<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = \App\Models\Invoice::whereHas('withdrawal', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->with('withdrawal')
            ->latest()
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }
}
