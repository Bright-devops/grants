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
            // whereHas('user') excludes applications whose owning account was
            // deleted (soft or hard) — same guard as KycController/WalletController,
            // so an orphaned row can never reach the page and crash on ->user->name.
            'applications' => GrantApplication::whereHas('user')
                ->with(['user:id,name,email', 'grantPlan:id,name'])
                ->latest()
                ->get(),
        ]);
    }

    public function approve(GrantApplication $application): RedirectResponse
    {
        // The application fee is no longer collected before approval — it's
        // now owed against the grant once disbursed, and collected the next
        // time the user requests a withdrawal. Approval is based on the
        // application itself, not a separate upfront payment.
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

        // Snapshot the plan's fee at the moment of disbursement — this is
        // what the user now owes, to be collected the next time they
        // request a withdrawal. Snapshotting protects against the plan's
        // fee changing later and retroactively altering what's owed.
        $application->update([
            'status' => 'disbursed',
            'fee_amount' => $application->grantPlan->application_fee,
        ]);

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