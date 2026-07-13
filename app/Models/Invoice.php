<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = ['invoice_number', 'withdrawal_id', 'pdf_path'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Invoice $invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->invoice_number = 'INV-' . now()->format('Y') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function withdrawal()
    {
        return $this->belongsTo(Withdrawal::class);
    }
}