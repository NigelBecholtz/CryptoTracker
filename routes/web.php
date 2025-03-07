<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// Landing page (public welcome page)
Route::get('/', function () {
    return view('landing');
})->name('landing');

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
    
    // Dashboard (requires authentication)
    Route::get('/dashboard', function () {
        return view('index');
    })->name('dashboard');

    // Markets page (requires authentication)
    Route::get('/markets', function () {
        return view('markets');
    })->name('markets');

    // Portfolio page (requires authentication)
    Route::get('/portfolio', function () {
        return view('portfolio');
    })->name('portfolio');

    // Coin details page (requires authentication)
    Route::get('/coin/{symbol}', function ($symbol) {
        return view('coin-details', ['symbol' => $symbol]);
    })->name('coin.details');
});
