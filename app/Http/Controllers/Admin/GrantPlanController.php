<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGrantPlanRequest;
use App\Http\Requests\Admin\UpdateGrantPlanRequest;
use App\Models\GrantPlan;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class GrantPlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/GrantPlans/Index', [
            'plans' => GrantPlan::withCount('applications')
                ->latest()
                ->get(),
        ]);
    }

    public function store(StoreGrantPlanRequest $request): RedirectResponse
    {
        GrantPlan::create($request->validated());

        return back()->with('success', 'Grant plan created successfully.');
    }

    public function update(UpdateGrantPlanRequest $request, GrantPlan $grantPlan): RedirectResponse
    {
        $grantPlan->update($request->validated());

        return back()->with('success', 'Grant plan updated successfully.');
    }

    public function destroy(GrantPlan $grantPlan): RedirectResponse
    {
        if ($grantPlan->applications()->exists()) {
            return back()->with('error', 'Cannot delete a plan that has applications. Deactivate it instead.');
        }

        $grantPlan->delete();

        return back()->with('success', 'Grant plan deleted successfully.');
    }

    public function toggleStatus(GrantPlan $grantPlan): RedirectResponse
    {
        $grantPlan->update([
            'status' => $grantPlan->status === 'active' ? 'inactive' : 'active',
        ]);

        return back()->with('success', 'Grant plan status updated.');
    }
}
