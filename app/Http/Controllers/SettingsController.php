<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class SettingsController extends Controller
{
    /**
     * Display the settings view.
     */
    public function index(): View
    {
        return view('settings');
    }

    /**
     * Update the user's settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => ['nullable', 'string', 'in:light,dark'],
            'notifications' => ['nullable', 'boolean'],
            'language' => ['nullable', 'string', 'in:en,nl'],
        ]);

        // Here we'll store the settings in the user's preferences
        // This will be implemented later when we add user preferences

        return redirect()->route('settings')->with('success', 'Settings updated successfully.');
    }
} 