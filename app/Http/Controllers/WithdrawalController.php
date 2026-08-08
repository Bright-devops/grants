<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWithdrawalRequest;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class WithdrawalController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Withdrawals/Index', [
            'withdrawals' => $request->user()->withdrawals()->latest()->get(),
            'wallet' => $request->user()->wallet,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Withdrawals/Create', [
            'wallet' => $request->user()->wallet,
            'feeOwed' => $request->user()->outstandingGrantFee(),
        ]);
    }

    public function store(StoreWithdrawalRequest $request, WalletService $walletService): RedirectResponse
    {
        $user = $request->user();
        $wallet = $user->wallet;
        $feeOwed = $user->outstandingGrantFee();

        $destinationDetails = match ($request->validated('method')) {
            'crypto' => ['wallet_address' => $request->validated('wallet_address')],
            'bank' => [
                'bank_name' => $request->validated('bank_name'),
                'account_name' => $request->validated('account_name'),
                'account_number' => $request->validated('account_number'),
                'routing_number' => $request->validated('routing_number'),
            ],
            'zelle' => ['zelle_email' => $request->validated('zelle_email')],
        };

        $withdrawal = null;

        try {
            DB::transaction(function () use ($user, $wallet, $request, $destinationDetails, $walletService, $feeOwed, &$withdrawal) {
                // Debit immediately — locks the funds so the user can't
                // double-spend across multiple withdrawal requests.
                $walletService->debit(
                    $wallet,
                    (float) $request->validated('amount'),
                    'Withdrawal request'
                );

                $withdrawal = Withdrawal::create([
                    'user_id' => $user->id,
                    'wallet_id' => $wallet->id,
                    'amount' => $request->validated('amount'),
                    'method' => $request->validated('method'),
                    'destination_details' => $destinationDetails,
                    // Snapshot whatever grant fee is currently outstanding —
                    // this withdrawal won't be processed until it's paid.
                    'fee_amount' => $feeOwed,
                    'fee_status' => $feeOwed > 0 ? 'not_paid' : 'not_required',
                ]);
            });
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        if ($feeOwed > 0) {
            return redirect()->route('withdrawals.pay-fee', $withdrawal)
                ->with('success', 'Withdrawal request submitted. A grant fee of $' . number_format($feeOwed, 2) . ' must be paid before it can be processed.');
        }

        return redirect()->route('withdrawals.index')->with('success', 'Withdrawal request submitted.');
    }
}