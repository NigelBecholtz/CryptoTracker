<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\CoinController;

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
    
    Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
    
    // Settings routes
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
    
    // Coin details route
    // Replace the existing coin details route with this:
    Route::get('/coin/{symbol}', [CoinController::class, 'show'])->name('coin.details');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Chatbot routes
Route::get('/chatbot-config', [App\Http\Controllers\ChatbotController::class, 'getConfig'])->name('chatbot.config');
Route::post('/chatbot-response', [App\Http\Controllers\ChatbotController::class, 'getResponse'])->name('chatbot.response');

// Test Route that doesn't require CSRF
Route::get('/test-huggingface', [App\Http\Controllers\TestController::class, 'testHuggingFace'])->name('test.huggingface');

require __DIR__.'/auth.php';
