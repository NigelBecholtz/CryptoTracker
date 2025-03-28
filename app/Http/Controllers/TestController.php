<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function testHuggingFace(Request $request)
    {
        // Get token
        $token = config('services.huggingface.token');
        
        // Test message
        $message = $request->input('message', 'What is Bitcoin?');
        $model = $request->input('model', 'gpt2');
        
        // Format the prompt without trailing text that gets included in response
        $prompt = "<s>[INST] You are CryptoAssistant, an AI designed to provide brief answers (2-3 sentences max) about cryptocurrency topics only. If asked about non-crypto topics, politely redirect to crypto.

User: {$message} [/INST]</s>";
        
        try {
            // Make the API call
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://api-inference.huggingface.co/models/{$model}");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => 80, // Reduced for shorter responses
                    'temperature' => 0.7,
                    'top_p' => 0.9,
                    'do_sample' => true,
                    'repetition_penalty' => 1.2, // Discourage repetitive responses
                    'return_full_text' => false // Only return new tokens, not the prompt
                ]
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json'
            ]);
            
            $response = curl_exec($ch);
            $info = curl_getinfo($ch);
            $error = curl_error($ch);
            curl_close($ch);
            
            return response()->json([
                'success' => $info['http_code'] == 200,
                'status_code' => $info['http_code'],
                'message' => $info['http_code'] == 200 ? 'Success' : 'API request failed with status code: ' . $info['http_code'],
                'error' => $error,
                'token_exists' => !empty($token),
                'token' => substr($token, 0, 5) . '...',
                'raw_response' => $response,
                'model_used' => $model
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'token_exists' => !empty($token),
                'token' => substr($token, 0, 5) . '...'
            ], 500);
        }
    }
} 