<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Withdrawal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'wallet_id',
        'reference',
        'amount',
        'fee_amount',
        'fee_status',
        'method',
        'destination_details',
        'status',
        'admin_notes',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee_amount' => 'decimal:2',
        'destination_details' => 'array',
        'paid_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Withdrawal $withdrawal) {
            if (empty($withdrawal->reference)) {
                $withdrawal->reference = 'WD-' . now()->format('Y') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function feePayment()
    {
        return $this->hasOne(Payment::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}