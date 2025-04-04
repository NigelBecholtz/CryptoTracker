<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'coin_symbol',
        'quantity'
    ];

    protected $casts = [
        'quantity' => 'decimal:8'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}