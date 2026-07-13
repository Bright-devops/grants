<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GrantPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'application_fee',
        'minimum_amount',
        'maximum_amount',
        'status',
    ];

    protected $casts = [
        'application_fee' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'maximum_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (GrantPlan $plan) {
            if (empty($plan->slug)) {
                $plan->slug = static::generateUniqueSlug($plan->name);
            }
        });

        static::updating(function (GrantPlan $plan) {
            if ($plan->isDirty('name') && !$plan->isDirty('slug')) {
                $plan->slug = static::generateUniqueSlug($plan->name, $plan->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;

        while (
            static::where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function applications()
    {
        return $this->hasMany(GrantApplication::class);
    }
}