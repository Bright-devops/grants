<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AdminAnnouncementNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Notifications/Index', [
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:1000'],
            'target' => ['required', 'in:all,selected'],
            'user_ids' => ['required_if:target,selected', 'array'],
            'user_ids.*' => ['exists:users,id'],
        ]);

        $recipients = $validated['target'] === 'all'
            ? User::all()
            : User::whereIn('id', $validated['user_ids'])->get();

        Notification::send($recipients, new AdminAnnouncementNotification($validated['title'], $validated['body']));

        return back()->with('success', "Sent to {$recipients->count()} user(s).");
    }
}
