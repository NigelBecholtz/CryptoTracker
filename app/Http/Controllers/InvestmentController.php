<?php

namespace App\Http\Controllers;

use App\Models\Investment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    public function buy(Request $request)
    {
        $request->validate([
            'crypto_symbol' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = auth()->user();
        $amount = $request->amount;

        if ($user->wallet_balance < $amount) {
            return response()->json([
                'error' => 'Insufficient funds'
            ], 400);
        }

        // Get current price from your API
        $currentPrice = // Fetch from your existing API
        $quantity = $amount / $currentPrice;

        DB::transaction(function () use ($user, $amount, $quantity, $request, $currentPrice) {
            // Deduct from wallet
            $user->decrement('wallet_balance', $amount);

            // Create investment
            Investment::create([
                'user_id' => $user->id,
                'crypto_symbol' => $request->crypto_symbol,
                'amount' => $amount,
                'quantity' => $quantity,
                'purchase_price' => $currentPrice,
            ]);
        });

        return response()->json([
            'message' => 'Investment successful',
            'new_balance' => $user->wallet_balance
        ]);
    }

    public function sell(Request $request)
    {
        $request->validate([
            'investment_id' => 'required|exists:investments,id',
        ]);

        $investment = Investment::findOrFail($request->investment_id);
        $user = auth()->user();

        if ($investment->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get current price from your API
        $currentPrice = // Fetch from your existing API
        $sellValue = $investment->quantity * $currentPrice;

        DB::transaction(function () use ($user, $investment, $sellValue) {
            // Add to wallet
            $user->increment('wallet_balance', $sellValue);

            // Remove investment
            $investment->delete();
        });

        return response()->json([
            'message' => 'Investment sold successfully',
            'new_balance' => $user->wallet_balance
        ]);
    }

    public function portfolio()
    {
        $user = auth()->user();
        $investments = $user->investments()->get()->map(function ($investment) {
            $currentValue = $investment->getCurrentValue();
            return [
                'id' => $investment->id,
                'symbol' => $investment->crypto_symbol,
                'quantity' => $investment->quantity,
                'invested_amount' => $investment->amount,
                'current_value' => $currentValue,
                'profit_loss' => $currentValue - $investment->amount,
                'profit_loss_percentage' => (($currentValue - $investment->amount) / $investment->amount) * 100,
            ];
        });

        return response()->json([
            'wallet_balance' => $user->wallet_balance,
            'investments' => $investments,
        ]);
    }
}