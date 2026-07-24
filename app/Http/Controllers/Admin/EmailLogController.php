<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use Inertia\Inertia;
use Inertia\Response;

class EmailLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Emails/Index', [
            'emails' => EmailLog::latest()->limit(200)->get(['id', 'to_email', 'subject', 'created_at']),
        ]);
    }

    public function show(EmailLog $email): Response
    {
        return Inertia::render('Admin/Emails/Show', [
            'email' => $email,
        ]);
    }
}