<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Kyc;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class KycController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Kyc/Index', [
            // whereHas('user') only matches rows whose user relation still
            // resolves. Since User uses soft deletes, this silently excludes
            // any KYC submission belonging to a soft-deleted or otherwise
            // missing user, before it ever reaches the frontend — this is
            // what stops kyc.user being null when the page maps over
            // submissions.
            'submissions' => Kyc::whereHas('user')
                ->with('user:id,name,email')
                ->latest()
                ->get()
                ->map(fn(Kyc $kyc) => [
                    'id' => $kyc->id,
                    'user' => $kyc->user,
                    'document_type' => $kyc->document_type,
                    // Served via KycDocumentController — auth + ownership/admin
                    // checked on every request, never a raw public storage path.
                    'document_front_url' => route('kyc.document', [$kyc, 'front']),
                    'document_back_url' => $kyc->document_back_path ? route('kyc.document', [$kyc, 'back']) : null,
                    'selfie_url' => $kyc->selfie_path ? route('kyc.document', [$kyc, 'selfie']) : null,
                    'status' => $kyc->status,
                    'rejection_reason' => $kyc->rejection_reason,
                    'created_at' => $kyc->created_at,
                ]),
        ]);
    }

    public function approve(Kyc $kyc): RedirectResponse
    {
        $kyc->update([
            'status' => 'approved',
            'rejection_reason' => null,
            'reviewed_at' => now(),
        ]);

        $kyc->user->notify(new \App\Notifications\KycStatusNotification($kyc));

        ActivityLog::log('kyc.approved', $kyc);

        return back()->with('success', 'KYC approved.');
    }

    public function reject(Request $request, Kyc $kyc): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:500'],
        ]);

        $kyc->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_at' => now(),
        ]);

        $kyc->user->notify(new \App\Notifications\KycStatusNotification($kyc));

        ActivityLog::log('kyc.rejected', $kyc, ['reason' => $kyc->rejection_reason]);

        return back()->with('success', 'KYC rejected.');
    }

    /**
     * Permanently delete a KYC submission. Used for unsuitable/spam/duplicate
     * submissions. Removes the underlying private-disk files along with the
     * record (forceDelete — no more trashed row left with deleted_at set),
     * and records who deleted it and what was deleted for audit purposes —
     * this is destructive and permanently removes someone's uploaded ID
     * documents.
     */
    public function destroy(Request $request, Kyc $kyc): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        foreach ([$kyc->document_front_path, $kyc->document_back_path, $kyc->selfie_path] as $path) {
            if ($path) {
                Storage::disk('local')->delete($path);
            }
        }

        ActivityLog::log('kyc.deleted', null, [
            'kyc_id' => $kyc->id,
            'user' => $kyc->user->email,
            'was_status' => $kyc->status,
            'reason' => $validated['reason'] ?? null,
        ]);

        $kyc->forceDelete();

        return back()->with('success', 'KYC submission permanently deleted.');
    }
}