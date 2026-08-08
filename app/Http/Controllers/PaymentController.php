<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\GrantApplication;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function create(GrantApplication $application): Response|RedirectResponse
    {
        $this->authorizeOwner($application);

        if ($application->payment_status !== 'not_paid') {
            return redirect()->route('applications.index')->with('error', 'This application already has a payment on file.');
        }

        return Inertia::render('Applications/Pay', [
            'application' => $application->load('grantPlan'),
            'methods' => PaymentMethod::where('status', 'active')->get(),
        ]);
    }

    public function store(StorePaymentRequest $request, GrantApplication $application): RedirectResponse
    {
        $this->authorizeOwner($application);

        // Payment proofs (bank transfer screenshots, transaction receipts) can
        // contain personal/financial details — store privately, same as KYC.
        $proofPath = $request->file('proof')->store("payments/{$application->user_id}", 'local');

        Payment::create([
            'user_id' => $application->user_id,
            'payment_method_id' => $request->validated('payment_method_id'),
            'grant_application_id' => $application->id,
            'amount' => $application->grantPlan->application_fee,
            'proof_path' => $proofPath,
            'transaction_hash' => $request->validated('transaction_hash'),
        ]);

        $application->update(['payment_status' => 'pending_confirmation']);

        return redirect()->route('applications.index')->with('success', 'Payment proof submitted. Awaiting confirmation.');
    }

    protected function authorizeOwner(GrantApplication $application): void
    {
        abort_unless($application->user_id === auth()->id(), 403);
    }
}
