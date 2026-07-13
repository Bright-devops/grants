<?php

namespace App\Services;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class WalletService
{
    public function credit(Wallet $wallet, float $amount, ?string $description = null): WalletTransaction
    {
        return $this->applyTransaction($wallet, 'credit', $amount, $description);
    }

    public function debit(Wallet $wallet, float $amount, ?string $description = null): WalletTransaction
    {
        return $this->applyTransaction($wallet, 'debit', $amount, $description);
    }

    protected function applyTransaction(Wallet $wallet, string $type, float $amount, ?string $description): WalletTransaction
    {
        if ($amount <= 0) {
            throw new RuntimeException('Transaction amount must be greater than zero.');
        }

        return DB::transaction(function () use ($wallet, $type, $amount, $description) {
            // Lock the wallet row until this transaction commits, preventing
            // concurrent credits/debits from racing each other.
            $wallet = Wallet::where('id', $wallet->id)->lockForUpdate()->first();

            if ($type === 'debit' && $wallet->balance < $amount) {
                throw new RuntimeException('Insufficient wallet balance.');
            }

            if ($type === 'credit') {
                $wallet->balance += $amount;
                $wallet->total_received += $amount;
            } else {
                $wallet->balance -= $amount;
                $wallet->total_withdrawn += $amount;
            }

            $wallet->save();

            return WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $description,
                'created_at' => now(),
            ]);
        });
    }
}