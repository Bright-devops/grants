<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FundWalletRequest;
use App\Models\ActivityLog;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Wallet/Index', [
            'wallets' => Wallet::with('user:id,name,email')
                ->whereHas('user') // exclude wallets whose user was deleted (soft or hard)
                ->latest()
                ->get(),
            'totals' => [
                'balance' => Wallet::sum('balance'),
                'received' => Wallet::sum('total_received'),
                'withdrawn' => Wallet::sum('total_withdrawn'),
            ],
        ]);
    }

    public function fund(FundWalletRequest $request, Wallet $wallet, WalletService $walletService): RedirectResponse
    {
        $walletService->credit(
            $wallet,
            (float) $request->validated('amount'),
            $request->validated('description') ?? 'Manual funding by admin'
        );

        ActivityLog::log('wallet.funded', $wallet, ['amount' => $request->validated('amount')]);

        return back()->with('success', 'Wallet funded successfully.');
    }
}