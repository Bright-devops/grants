<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use App\Services\UserDeletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['wallet', 'latestKyc'])
            ->withCount('grantApplications')
            ->latest()
            ->get()
            ->map(fn(User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'country' => $user->country,
                'whatsapp' => $user->whatsapp,
                'status' => $user->status,
                'kyc_status' => $user->latestKyc?->status ?? 'not_submitted',
                'wallet_balance' => $user->wallet?->balance ?? 0,
                'applications_count' => $user->grant_applications_count,
                'is_admin' => $user->hasRole('admin'),
                'created_at' => $user->created_at,
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'country' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update($validated);

        ActivityLog::log('user.updated', $user);

        return back()->with('success', "{$user->name}'s details updated.");
    }

    public function suspend(User $user): RedirectResponse
    {
        abort_if($user->hasRole('admin'), 403, 'Cannot suspend an admin.');

        $user->update(['status' => 'suspended']);

        ActivityLog::log('user.suspended', $user);

        return back()->with('success', "{$user->name} has been suspended.");
    }

    public function activate(User $user): RedirectResponse
    {
        $user->update(['status' => 'active']);

        ActivityLog::log('user.activated', $user);

        return back()->with('success', "{$user->name} has been reactivated.");
    }

    /**
     * Permanently delete a user AND everything connected to them — wallet,
     * KYC submissions (+ files), grant applications, payments, and
     * withdrawals — in one click. UserDeletionService cascades all of it
     * via the DB's own cascadeOnDelete FKs. No financial guards: wallet
     * balance and withdrawal status are not checked. The only remaining
     * protection is that admins can't be deleted at all.
     */
    public function destroy(User $user, UserDeletionService $userDeletionService): RedirectResponse
    {
        abort_if($user->hasRole('admin'), 403, 'Cannot delete an admin.');

        ActivityLog::log('user.deleted', null, [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);

        $userDeletionService->forceDelete($user);

        return back()->with('success', "{$user->name} and all associated records have been permanently deleted.");
    }

    public function bulkDestroy(Request $request, UserDeletionService $userDeletionService): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:users,id'],
        ]);

        $users = User::whereIn('id', $validated['ids'])->get();

        $deletedCount = 0;
        $skippedAdmins = 0;

        foreach ($users as $user) {
            // Never let a bulk action take out an admin account, even if
            // it was somehow included in the selection (e.g. a stale
            // checkbox list from before a role change).
            if ($user->hasRole('admin')) {
                $skippedAdmins++;
                continue;
            }

            ActivityLog::log('user.deleted', null, [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);

            $userDeletionService->forceDelete($user);
            $deletedCount++;
        }

        $message = $deletedCount === 1
            ? '1 user and all associated records permanently deleted.'
            : "{$deletedCount} users and all associated records permanently deleted.";
        if ($skippedAdmins > 0) {
            $message .= $skippedAdmins === 1
                ? ' 1 admin account was skipped.'
                : " {$skippedAdmins} admin accounts were skipped.";
        }

        return back()->with('success', $message);
    }

    public function makeAdmin(User $user): RedirectResponse
    {
        $user->assignRole('admin');

        ActivityLog::log('user.made_admin', $user);

        return back()->with('success', "{$user->name} is now an admin.");
    }

    public function removeAdmin(User $user): RedirectResponse
    {
        abort_if($user->id === auth()->id(), 403, 'You cannot remove your own admin role.');

        $user->removeRole('admin');

        ActivityLog::log('user.removed_admin', $user);

        return back()->with('success', "{$user->name} is no longer an admin.");
    }
}