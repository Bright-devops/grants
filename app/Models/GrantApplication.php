<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GrantApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'grant_plan_id',
        'reference',
        'requested_amount',
        'status',
        'payment_status',
        'admin_notes',
        'reviewed_at',
    ];

    protected $casts = [
        'requested_amount' => 'decimal:2',
        'reviewed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (GrantApplication $application) {
            if (empty($application->reference)) {
                $application->reference = static::generateReference();
            }
        });
    }

    protected static function generateReference(): string
    {
        do {
            $reference = 'GRT-' . now()->format('Y') . '-' . strtoupper(Str::random(6));
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function grantPlan()
    {
        return $this->belongsTo(GrantPlan::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}