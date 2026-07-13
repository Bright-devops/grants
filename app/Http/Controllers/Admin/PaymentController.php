<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Payments/Index', [
            'payments' => Payment::with(['user:id,name,email', 'paymentMethod:id,name', 'grantApplication:id,reference'])
                ->latest()
                ->get()
                ->map(fn(Payment $p) => [
                    'id' => $p->id,
                    'user' => $p->user,
                    'payment_method' => $p->paymentMethod,
                    'application_reference' => $p->grantApplication?->reference,
                    'amount' => $p->amount,
                    'proof_url' => Storage::url($p->proof_path),
                    'transaction_hash' => $p->transaction_hash,
                    'status' => $p->status,
                    'created_at' => $p->created_at,
                ]),
        ]);
    }

    public function confirm(Payment $payment): RedirectResponse
    {
        $payment->update(['status' => 'confirmed']);

        $payment->grantApplication?->update([
            'payment_status' => 'confirmed',
            'status' => 'under_review',
        ]);

        return back()->with('success', 'Payment confirmed.');
    }

    public function reject(Payment $payment): RedirectResponse
    {
        $payment->update(['status' => 'failed']);

        $payment->grantApplication?->update(['payment_status' => 'not_paid']);

        return back()->with('success', 'Payment rejected.');
    }
}