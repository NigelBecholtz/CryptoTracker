<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', function () {
    return view('landing');
})->name('landing');

// Protected routes - require authentication
Route::middleware(['auth'])->group(function () {
    Route::get('/home', function () {
        return view('index');
    })->name('home');
    
    Route::get('/index', function () {
        return view('index');
    })->name('index');
    
    Route::get('/market', function () {
        return view('markets');
    })->name('market');
    
    Route::get('/portfolio', function () {
        return view('portfolio');
    })->name('portfolio');
    
    // Coin details route
    Route::get('/coin/{symbol}', function ($symbol) {
        return view('coin-details', ['symbol' => $symbol]);
    })->name('coin.details');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
