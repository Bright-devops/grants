<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GrantPlan;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Public/Home', [
            'plans' => GrantPlan::active()->orderBy('minimum_amount')->limit(4)->get(),
            'testimonials' => Testimonial::where('is_featured', true)->limit(3)->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('Public/About');
    }

    public function faq(): Response
    {
        return Inertia::render('Public/Faq');
    }

    public function grantPlans(): Response
    {
        return Inertia::render('Public/GrantPlans', [
            'plans' => GrantPlan::active()->orderBy('minimum_amount')->get(),
        ]);
    }
}
