// Add the chatbot routes
Route::post('/chatbot/response', [App\Http\Controllers\ChatbotController::class, 'getResponse'])->name('chatbot.response');
Route::get('/chatbot/config', [App\Http\Controllers\ChatbotController::class, 'getConfig'])->name('chatbot.config'); 