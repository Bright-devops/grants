<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\GrantApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Applications/Index', [
            'applications' => GrantApplication::with(['user:id,name,email', 'grantPlan:id,name'])
                ->latest()
                ->get(),
        ]);
    }

    public function approve(GrantApplication $application): RedirectResponse
    {
        if ($application->payment_status !== 'confirmed') {
            return back()->with('error', 'Payment must be confirmed before approving this application.');
        }

        $application->update([
            'status' => 'approved',
            'reviewed_at' => now(),
        ]);

        $application->user->notify(new \App\Notifications\ApplicationStatusNotification($application));
        ActivityLog::log('application.approved', $application);

        return back()->with('success', 'Application approved.');
    }

    public function reject(Request $request, GrantApplication $application): RedirectResponse
    {
        $validated = $request->validate([
            'admin_notes' => ['required', 'string', 'max:500'],
        ]);

        $application->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'reviewed_at' => now(),
        ]);

        $application->user->notify(new \App\Notifications\ApplicationStatusNotification($application));
        ActivityLog::log('application.rejected', $application, ['reason' => $validated['admin_notes']]);

        return back()->with('success', 'Application rejected.');
    }

    public function disburse(GrantApplication $application, \App\Services\WalletService $walletService): RedirectResponse
    {
        if ($application->status !== 'approved') {
            return back()->with('error', 'Only approved applications can be disbursed.');
        }

        $wallet = $application->user->wallet;

        $walletService->credit(
            $wallet,
            (float) $application->requested_amount,
            "Grant disbursement — {$application->reference}"
        );

        $application->update(['status' => 'disbursed']);

        $application->user->notify(new \App\Notifications\ApplicationStatusNotification($application));
        ActivityLog::log('application.disbursed', $application, ['amount' => $application->requested_amount]);

        return back()->with('success', 'Grant disbursed to user wallet.');
    }

    public function destroy(GrantApplication $application): RedirectResponse
    {
        if ($application->status === 'disbursed') {
            return back()->with('error', 'Cannot delete a disbursed application — funds have already been paid out.');
        }

        ActivityLog::log('application.deleted', null, [
            'reference' => $application->reference,
            'user' => $application->user->email,
        ]);

        $application->delete();

        return back()->with('success', 'Application deleted.');
    }
}
