<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'country',
        'whatsapp',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function grantApplications()
    {
        return $this->hasMany(GrantApplication::class);
    }

    public function kycs()
    {
        return $this->hasMany(Kyc::class);
    }

    public function latestKyc()
    {
        return $this->hasOne(Kyc::class)->latestOfMany();
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Fee helpers
    |--------------------------------------------------------------------------
    */

    /**
     * Total outstanding grant fee across all disbursed applications that
     * haven't had their fee collected yet. Charged when the user next
     * requests a withdrawal, rather than before their application is
     * reviewed.
     */
    public function outstandingGrantFee(): float
    {
        return (float) $this->grantApplications()
            ->where('status', 'disbursed')
            ->whereNotNull('fee_amount')
            ->whereNull('fee_paid_at')
            ->sum('fee_amount');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }
}