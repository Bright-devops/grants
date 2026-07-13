<?php

namespace App\Http\Controllers;

use App\Models\GrantApplication;
use App\Models\GrantPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Applications/Index', [
            'applications' => $request->user()
                ->grantApplications()
                ->with('grantPlan')
                ->latest()
                ->get(),
        ]);
    }

    public function create(Request $request, GrantPlan $grantPlan): Response|RedirectResponse
    {
        if (! $this->kycApproved($request)) {
            return redirect()
                ->route('grant-plans.index')
                ->with('error', 'Please verify your account before applying.');
        }

        return Inertia::render('Applications/Create', [
            'plan' => $grantPlan,
        ]);
    }

    public function store(Request $request, GrantPlan $grantPlan): RedirectResponse
    {
        if (! $this->kycApproved($request)) {
            return redirect()
                ->route('grant-plans.index')
                ->with('error', 'Please verify your account before applying.');
        }

        $validated = $request->validate([
            'requested_amount' => [
                'required',
                'numeric',
                'min:' . $grantPlan->minimum_amount,
                'max:' . $grantPlan->maximum_amount,
            ],
        ]);

        GrantApplication::create([
            'user_id' => $request->user()->id,
            'grant_plan_id' => $grantPlan->id,
            'requested_amount' => $validated['requested_amount'],
        ]);

        return redirect()
            ->route('applications.index')
            ->with('success', 'Application submitted successfully.');
    }

    protected function kycApproved(Request $request): bool
    {
        return $request->user()->latestKyc?->status === 'approved';
    }
}
