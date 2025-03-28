<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'crypto_symbol',
        'amount',
        'quantity',
        'purchase_price',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'quantity' => 'decimal:8',
        'purchase_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getCurrentValue()
    {
        $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
            'ids' => strtolower($this->crypto_symbol),
            'vs_currencies' => 'eur'
        ]);

        if ($response->successful()) {
            $currentPrice = $response->json()[strtolower($this->crypto_symbol)]['eur'];
            return $this->quantity * $currentPrice;
        }

        return 0; // Return 0 if API call fails
    }
}