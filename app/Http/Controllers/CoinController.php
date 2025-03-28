<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CoinController extends Controller
{
    public function show($symbol)
    {
        // For now, we'll just pass the symbol
        return view('coin-details', [
            'symbol' => $symbol,
            'coinName' => strtoupper($symbol)
        ]);
    }
}