<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
        ], [
            'password.min' => 'Het wachtwoord moet minimaal 8 karakters lang zijn.',
            'password.letters' => 'Het wachtwoord moet minimaal één letter bevatten.',
            'password.mixed' => 'Het wachtwoord moet minimaal één hoofdletter en één kleine letter bevatten.',
            'password.numbers' => 'Het wachtwoord moet minimaal één cijfer bevatten.',
            'password.symbols' => 'Het wachtwoord moet minimaal één speciaal teken bevatten.',
            'password.uncompromised' => 'Dit wachtwoord is te zwak. Kies een sterker wachtwoord.',
            'password.confirmed' => 'De wachtwoorden komen niet overeen.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }
} 