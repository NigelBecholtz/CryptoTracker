<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="night">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'CryptoTracker') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
        <!-- Tailwind CSS and DaisyUI -->
        <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Font Awesome for Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-base-200 min-h-screen">
        <div class="navbar bg-base-100 shadow-xl mb-8">
            <div class="navbar-start">
                <a href="/" class="btn btn-ghost text-xl">
                    <i class="fas fa-chart-line mr-2"></i>
                    <span>CryptoTracker</span>
                </a>
            </div>
        </div>

        <div class="min-h-screen flex flex-col justify-center items-center p-4">
            <div class="card w-full max-w-md bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title text-2xl font-bold text-center mb-6 w-full">
                        <i class="fas fa-user-shield mr-2"></i>
                        {{ isset($title) ? $title : (Route::is('login') ? 'Login' : 'Register') }}
                    </h2>
                    {{ $slot }}
                </div>
            </div>
        </div>
        
        <footer class="footer footer-center p-4 bg-base-100 text-base-content mt-auto">
            <div>
                <p>© {{ date('Y') }} CryptoTracker - All rights reserved</p>
            </div>
        </footer>
    </body>
</html>
