<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $investments = Investment::where('user_id', $user->id)
            ->get()
            ->map(function ($investment) {
                // Get current price from API
                $currentPrice = 100; // Replace with actual API call
                $currentValue = $investment->quantity * $currentPrice;
                
                return [
                    'id' => $investment->id,
                    'crypto_name' => $investment->crypto_name,
                    'crypto_symbol' => $investment->crypto_symbol,
                    'quantity' => $investment->quantity,
                    'purchase_price' => $investment->purchase_price,
                    'current_value' => $currentValue,
                    'profit_loss' => $currentValue - ($investment->quantity * $investment->purchase_price),
                    'profit_loss_percentage' => (($currentValue - ($investment->quantity * $investment->purchase_price)) / ($investment->quantity * $investment->purchase_price)) * 100
                ];
            });

        return view('portfolio', compact('investments'));
    }
}