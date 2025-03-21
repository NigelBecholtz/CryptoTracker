<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
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
    
    Route::get('/market', function () {
        return view('markets');
    })->name('market');
    
    Route::get('/portfolio', function () {
        return view('portfolio');
    })->name('portfolio');
    
    // Settings routes
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
    
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
