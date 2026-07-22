<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
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

    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->hasRole('admin'), 403, 'Cannot delete an admin.');

        ActivityLog::log('user.deleted', $user);

        $user->delete();

        return back()->with('success', 'User deleted.');
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
