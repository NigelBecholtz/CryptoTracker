<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class PortfolioController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get user's portfolio items
        $portfolioItems = Portfolio::where('user_id', $user->id)->get();
        
        $investments = [];
        $totalPortfolioValue = 0;
        
        foreach ($portfolioItems as $item) {
            // Skip if quantity is 0
            if ($item->quantity <= 0) {
                continue;
            }
            
            // Get current price data for this coin
            try {
                // Remove USD suffix for API call
                $coinId = strtolower(str_replace('-usd', '', $item->coin_symbol));
                
                $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
                    'ids' => $coinId,
                    'vs_currencies' => 'eur',
                    'include_24hr_change' => 'true'
                ]);
                
                $priceData = $response->json();
                
                // If we can't find the coin in the response, try a fallback approach
                if (!isset($priceData[$coinId])) {
                    // Try with different formatting
                    $coinId = strtolower(str_replace(['-usd', '-USD'], '', $item->coin_symbol));
                    
                    // For coins like BTC-USD, ETH-USD, etc.
                    if (in_array($coinId, ['btc', 'eth', 'ltc', 'xrp', 'bch', 'ada', 'dot', 'link', 'xlm', 'doge'])) {
                        $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
                            'ids' => $coinId,
                            'vs_currencies' => 'eur',
                            'include_24hr_change' => 'true'
                        ]);
                        $priceData = $response->json();
                    }
                }
                
                // Calculate current value and profit/loss
                $currentPrice = $priceData[$coinId]['eur'] ?? 0;
                
                if ($currentPrice == 0) {
                    // Fallback to the price from the last transaction if API fails
                    $lastTransaction = Transaction::where('user_id', $user->id)
                        ->where('coin_symbol', $item->coin_symbol)
                        ->orderBy('created_at', 'desc')
                        ->first();
                    
                    $currentPrice = $lastTransaction ? $lastTransaction->price : 0;
                }
                
                $currentValue = $item->quantity * $currentPrice;
                $totalPortfolioValue += $currentValue;
                
                // Get purchase transactions to calculate average buy price
                $buyTransactions = Transaction::where('user_id', $user->id)
                    ->where('coin_symbol', $item->coin_symbol)
                    ->where('type', 'buy')
                    ->get();
                
                $totalSpent = $buyTransactions->sum('total_amount');
                $totalQuantity = $buyTransactions->sum('quantity');
                $avgBuyPrice = $totalQuantity > 0 ? $totalSpent / $totalQuantity : 0;
                
                // Calculate profit/loss
                $profitLoss = $currentValue - $totalSpent;
                $profitLossPercentage = $totalSpent > 0 ? ($profitLoss / $totalSpent) * 100 : 0;
                
                // Get coin name
                $coinName = ucfirst(str_replace(['-usd', '-USD'], '', $item->coin_symbol));
                
                $investments[] = [
                    'id' => $item->id,
                    'crypto_name' => $coinName,
                    'crypto_symbol' => $item->coin_symbol,
                    'quantity' => $item->quantity,
                    'avg_buy_price' => $avgBuyPrice,
                    'current_price' => $currentPrice,
                    'current_value' => $currentValue,
                    'profit_loss' => $profitLoss,
                    'profit_loss_percentage' => $profitLossPercentage,
                    'price_change_24h' => $priceData[$coinId]['eur_24h_change'] ?? 0
                ];
            } catch (\Exception $e) {
                // If API call fails, try to use the last known price
                $lastTransaction = Transaction::where('user_id', $user->id)
                    ->where('coin_symbol', $item->coin_symbol)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $currentPrice = $lastTransaction ? $lastTransaction->price : 0;
                $currentValue = $item->quantity * $currentPrice;
                
                $investments[] = [
                    'id' => $item->id,
                    'crypto_name' => ucfirst(str_replace(['-usd', '-USD'], '', $item->coin_symbol)),
                    'crypto_symbol' => $item->coin_symbol,
                    'quantity' => $item->quantity,
                    'avg_buy_price' => $currentPrice,
                    'current_price' => $currentPrice,
                    'current_value' => $currentValue,
                    'profit_loss' => 0,
                    'profit_loss_percentage' => 0,
                    'price_change_24h' => 0
                ];
            }
        }
        
        return view('portfolio', [
            'investments' => $investments
        ]);
    }
    
    public function sellInvestment(Request $request)
    {
        $request->validate([
            'portfolio_id' => 'required|exists:portfolios,id',
            'quantity' => 'required|numeric|min:0.00000001',
        ]);
        
        $user = Auth::user();
        $portfolioItem = Portfolio::findOrFail($request->portfolio_id);
        
        // Ensure the portfolio item belongs to the user
        if ($portfolioItem->user_id !== $user->id) {
            return redirect()->back()->with('error', 'You do not own this investment.');
        }
        
        // Ensure the user has enough quantity to sell
        if ($portfolioItem->quantity < $request->quantity) {
            return redirect()->back()->with('error', 'You do not have enough coins to sell.');
        }
        
        // Get current price for the coin
        try {
            $coinId = strtolower(str_replace(['-usd', '-USD'], '', $portfolioItem->coin_symbol));
            
            $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
                'ids' => $coinId,
                'vs_currencies' => 'eur'
            ]);
            
            $priceData = $response->json();
            $currentPrice = $priceData[$coinId]['eur'] ?? 0;
            
            if ($currentPrice == 0) {
                // Fallback to the price from the last transaction if API fails
                $lastTransaction = Transaction::where('user_id', $user->id)
                    ->where('coin_symbol', $portfolioItem->coin_symbol)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $currentPrice = $lastTransaction ? $lastTransaction->price : 0;
            }
            
            // Calculate total amount
            $totalAmount = $request->quantity * $currentPrice;
            
            // Begin transaction
            DB::beginTransaction();
            
            try {
                // Update portfolio quantity
                $portfolioItem->quantity -= $request->quantity;
                $portfolioItem->save();
                
                // Add to user's wallet balance
                $user->wallet_balance += $totalAmount;
                $user->save();
                
                // Record transaction
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'sell',
                    'coin_symbol' => $portfolioItem->coin_symbol,
                    'quantity' => $request->quantity,
                    'price' => $currentPrice,
                    'total_amount' => $totalAmount
                ]);
                
                // If quantity is now 0, delete the portfolio item
                if ($portfolioItem->quantity <= 0) {
                    $portfolioItem->delete();
                }
                
                DB::commit();
                
                return redirect()->back()->with([
                    'success' => "Successfully sold {$request->quantity} {$portfolioItem->coin_symbol}!",
                    'wallet_balance' => $user->wallet_balance
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Transaction failed: ' . $e->getMessage());
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Could not get current price: ' . $e->getMessage());
        }
    }
}