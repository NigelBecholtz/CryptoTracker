<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class PortfolioController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get user's portfolio items
        $portfolioItems = Portfolio::where('user_id', $user->id)->get();
        
        $investments = [];
        
        foreach ($portfolioItems as $item) {
            // Get current price data for this coin
            try {
                $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
                    'ids' => strtolower(str_replace('-USD', '', $item->coin_symbol)),
                    'vs_currencies' => 'eur',
                    'include_24hr_change' => 'true'
                ]);
                
                $priceData = $response->json();
                $coinId = strtolower(str_replace('-USD', '', $item->coin_symbol));
                
                // Calculate current value and profit/loss
                $currentPrice = $priceData[$coinId]['eur'] ?? 0;
                $currentValue = $item->quantity * $currentPrice;
                
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
                $coinName = ucfirst(str_replace('-usd', '', strtolower($item->coin_symbol)));
                
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
                // If API call fails, add basic info
                $investments[] = [
                    'id' => $item->id,
                    'crypto_name' => ucfirst(str_replace('-usd', '', strtolower($item->coin_symbol))),
                    'crypto_symbol' => $item->coin_symbol,
                    'quantity' => $item->quantity,
                    'avg_buy_price' => 0,
                    'current_price' => 0,
                    'current_value' => 0,
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
        // This will be implemented later for selling functionality
        return redirect()->back()->with('error', 'Sell functionality coming soon!');
    }
}