<?php

namespace App\Http\Controllers;

use App\Models\GrantPlan;
use Inertia\Inertia;
use Inertia\Response;

class GrantPlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('GrantPlans/Index', [
            'plans' => GrantPlan::active()->orderBy('minimum_amount')->get(),
        ]);
    }
}
