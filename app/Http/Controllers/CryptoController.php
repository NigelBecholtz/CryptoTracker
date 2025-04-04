<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Portfolio;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CryptoController extends Controller
{
    // Other methods...

    /**
     * Process a crypto purchase
     */
    public function buyCrypto(Request $request)
    {
        $request->validate([
            'coin_symbol' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'price' => 'required|numeric|min:0'
        ]);

        $user = Auth::user();
        $amount = $request->amount;
        $coinSymbol = $request->coin_symbol;
        $price = $request->price;
        
        // Check if user has enough balance
        if ($user->wallet_balance < $amount) {
            return redirect()->back()->with('error', 'Insufficient funds in your wallet.');
        }
        
        // Calculate quantity of crypto to buy
        $quantity = $amount / $price;
        
        // Begin transaction
        DB::beginTransaction();
        
        try {
            // Deduct from wallet
            $user->wallet_balance -= $amount;
            $user->save();
            
            // Record transaction
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'buy',
                'coin_symbol' => $coinSymbol,
                'quantity' => $quantity,
                'price' => $price,
                'total_amount' => $amount
            ]);
            
            // Update or create portfolio entry
            $portfolio = Portfolio::firstOrNew([
                'user_id' => $user->id,
                'coin_symbol' => $coinSymbol
            ]);
            
            $portfolio->quantity = ($portfolio->quantity ?? 0) + $quantity;
            $portfolio->save();
            
            DB::commit();
            
            // Return with success message and updated wallet balance
            return redirect()->back()->with([
                'success' => "Successfully purchased {$quantity} {$coinSymbol}!",
                'wallet_balance' => $user->wallet_balance
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Transaction failed: ' . $e->getMessage());
        }
    }
}