<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Payments/Index', [
            'payments' => Payment::with(['user:id,name,email', 'paymentMethod:id,name', 'grantApplication:id,reference', 'withdrawal:id,reference'])
                ->latest()
                ->get()
                ->map(fn(Payment $p) => [
                    'id' => $p->id,
                    'user' => $p->user,
                    'payment_method' => $p->paymentMethod,
                    'reference' => $p->grantApplication?->reference ?? $p->withdrawal?->reference,
                    'purpose' => $p->grant_application_id ? 'Application fee' : 'Withdrawal fee',
                    'amount' => $p->amount,
                    // Served via PaymentProofController — auth + ownership/admin
                    // checked on every request, never a raw public storage path.
                    'proof_url' => route('payments.proof', $p),
                    'transaction_hash' => $p->transaction_hash,
                    'status' => $p->status,
                    'created_at' => $p->created_at,
                ]),
        ]);
    }

    public function confirm(Payment $payment): RedirectResponse
    {
        $payment->update(['status' => 'confirmed']);

        // Legacy path — a small number of pre-existing payments may still be
        // tied to an application fee rather than a withdrawal fee.
        $payment->grantApplication?->update([
            'payment_status' => 'confirmed',
            'status' => 'under_review',
        ]);

        if ($payment->withdrawal) {
            $payment->withdrawal->update(['fee_status' => 'confirmed']);

            // The withdrawal's fee_amount was a snapshot of every disbursed,
            // still-unpaid application fee this user owed at request time.
            // Confirming payment settles exactly those.
            $payment->withdrawal->user->grantApplications()
                ->where('status', 'disbursed')
                ->whereNotNull('fee_amount')
                ->whereNull('fee_paid_at')
                ->update(['fee_paid_at' => now()]);
        }

        $payment->user->notify(new \App\Notifications\PaymentStatusNotification($payment));

        ActivityLog::log('payment.confirmed', $payment);

        return back()->with('success', 'Payment confirmed.');
    }

    public function reject(Payment $payment): RedirectResponse
    {
        $payment->update(['status' => 'failed']);

        $payment->grantApplication?->update(['payment_status' => 'not_paid']);
        $payment->withdrawal?->update(['fee_status' => 'not_paid']);

        $payment->user->notify(new \App\Notifications\PaymentStatusNotification($payment));

        ActivityLog::log('payment.rejected', $payment);

        return back()->with('success', 'Payment rejected.');
    }
}