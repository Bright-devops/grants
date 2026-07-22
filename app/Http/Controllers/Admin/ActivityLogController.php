<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => ActivityLog::with('user:id,name,email')
                ->latest()
                ->limit(200)
                ->get(),
        ]);
    }
}
