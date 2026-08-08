<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Withdrawal;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WithdrawalFeeController extends Controller
{
    public function create(Withdrawal $withdrawal): Response|RedirectResponse
    {
        $this->authorizeOwner($withdrawal);

        if ($withdrawal->fee_status === 'not_required') {
            return redirect()->route('withdrawals.index')->with('error', 'No fee is owed on this withdrawal.');
        }

        if ($withdrawal->fee_status !== 'not_paid') {
            return redirect()->route('withdrawals.index')->with('error', 'This withdrawal already has a fee payment on file.');
        }

        return Inertia::render('Withdrawals/PayFee', [
            'withdrawal' => $withdrawal,
            'methods' => PaymentMethod::where('status', 'active')->get(),
        ]);
    }

    public function store(StorePaymentRequest $request, Withdrawal $withdrawal): RedirectResponse
    {
        $this->authorizeOwner($withdrawal);

        if ($withdrawal->fee_status !== 'not_paid') {
            return redirect()->route('withdrawals.index')->with('error', 'This withdrawal already has a fee payment on file.');
        }

        // Same private-disk treatment as KYC/application-fee proofs.
        $proofPath = $request->file('proof')->store("payments/{$withdrawal->user_id}", 'local');

        Payment::create([
            'user_id' => $withdrawal->user_id,
            'payment_method_id' => $request->validated('payment_method_id'),
            'withdrawal_id' => $withdrawal->id,
            'amount' => $withdrawal->fee_amount,
            'proof_path' => $proofPath,
            'transaction_hash' => $request->validated('transaction_hash'),
        ]);

        $withdrawal->update(['fee_status' => 'pending_confirmation']);

        return redirect()->route('withdrawals.index')->with('success', 'Fee payment proof submitted. Awaiting confirmation.');
    }

    protected function authorizeOwner(Withdrawal $withdrawal): void
    {
        abort_unless($withdrawal->user_id === auth()->id(), 403);
    }
}