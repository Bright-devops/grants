<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'photo_path', 'country', 'message', 'rating', 'is_featured'];

    protected $casts = ['is_featured' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}