<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    /**
     * Get a message response from the Hugging Face API
     */
    public function getResponse(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $message = $request->input('message');
        $model = 'mistralai/Mistral-7B-Instruct-v0.2'; // You can change to another model if preferred

        // Format the prompt for crypto-specific context
        $prompt = "<s>[INST] You are a helpful cryptocurrency assistant. 
                Provide accurate and informative responses about blockchain technology, 
                crypto trading, tokens, and market analysis. 
                
                User question: {$message} [/INST]</s>";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.huggingface.token'),
                'Content-Type' => 'application/json',
            ])->post("https://api-inference.huggingface.co/models/{$model}", [
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => 250,
                    'temperature' => 0.7,
                    'top_p' => 0.9,
                    'do_sample' => true,
                ],
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'API request failed: ' . $response->status(),
                ], 500);
            }

            $result = $response->json();
            $aiResponse = '';

            // Handle the response format based on the model
            if (is_array($result) && isset($result[0]['generated_text'])) {
                $fullText = $result[0]['generated_text'];
                // Extract the text after the prompt
                $parts = explode('[/INST]</s>', $fullText);
                $aiResponse = isset($parts[1]) ? trim($parts[1]) : $fullText;
            } elseif (is_array($result) && isset($result['generated_text'])) {
                $aiResponse = $result['generated_text'];
            } else {
                $aiResponse = "I'm having trouble connecting to my knowledge base. Please try again later.";
            }

            return response()->json([
                'success' => true,
                'response' => $aiResponse,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get the Hugging Face API token configuration
     */
    public function getConfig()
    {
        return response()->json([
            'hasToken' => !empty(config('services.huggingface.token')),
        ]);
    }
} 