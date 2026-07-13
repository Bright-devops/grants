<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class WalletTransaction extends Model
{
    use HasFactory;

    public $timestamps = false; // only has created_at, no updated_at — ledger rows are immutable

    protected $fillable = [
        'wallet_id',
        'type',
        'amount',
        'balance_after',
        'description',
        'reference',
        'created_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (WalletTransaction $transaction) {
            if (empty($transaction->reference)) {
                $transaction->reference = 'TXN-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
}