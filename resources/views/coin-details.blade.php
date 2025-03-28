<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coin Details - CryptoTracker</title>
    
    <!-- Tailwind CSS and DaisyUI -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-base-200 min-h-screen">
    <!-- Navigation -->
    <div class="fixed top-0 left-0 right-0 z-50">
        <div class="navbar bg-base-100 shadow-xl">
           <div class="navbar-start">
               <div class="dropdown lg:hidden">
                   <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                       <i class="fas fa-bars"></i>
                   </div>
                   <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                       <li><a href="{{ route('home') }}">Home</a></li>
                       <li><a href="{{ route('market') }}">Market</a></li>
                       <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
                   </ul>
               </div>
               <a href="{{ route('landing') }}" class="btn btn-ghost text-xl">
                   <i class="fas fa-chart-line mr-2"></i>
                   <span class="hidden sm:inline">CryptoTracker</span>
               </a>
           </div>
           <div class="navbar-center hidden lg:flex">
               <ul class="menu menu-horizontal px-1">
                   <li><a href="{{ route('home') }}">Home</a></li>
                   <li><a href="{{ route('market') }}">Market</a></li>
                   <li><a href="{{ route('portfolio') }}">Portfolio</a></li>
               </ul>
           </div>
           <div class="navbar-end">
               <div class="flex items-center space-x-4">
                   <button class="btn btn-ghost btn-circle">
                       <i class="fas fa-bell"></i>
                   </button>
                   <div class="dropdown dropdown-end">
                       <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                           <div class="w-10 rounded-full">
                               <img alt="User Avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=cryptouser" />
                           </div>
                       </div>
                       <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                           <li><a>Profile</a></li>
                           <li><a>Settings</a></li>
                           <li><a>Logout</a></li>
                       </ul>
                   </div>
               </div>
           </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pt-24">
        <!-- Loading Indicator -->
        <div id="loadingIndicator" class="fixed top-0 left-0 right-0 bottom-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-50">
            <div class="loading loading-spinner loading-lg"></div>
        </div>

        <!-- Error container for dynamic alerts -->
        <div id="errorContainer"></div>

        <!-- Coin Header -->
        <div class="card bg-base-100 shadow-xl mb-6">
            <div class="card-body">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="flex items-center gap-4">
                        <div class="avatar placeholder">
                            <div id="coinIcon" class="bg-neutral-focus text-neutral-content rounded-full w-16">
                                <span class="text-xl" id="coinInitials">...</span>
                            </div>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold" id="coinName">Loading...</h1>
                            <p class="text-lg opacity-70" id="coinSymbol">...</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-mono" id="coinPrice">...</div>
                        <div class="text-lg" id="priceChange">
                            <span class="loading loading-spinner loading-sm"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Price Chart -->
        <div class="card bg-base-100 shadow-xl mb-6">
            <div class="card-body">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="card-title">Price Chart</h2>
                    <div class="join">
                        <button class="join-item btn btn-sm" data-timeframe="1HRS" data-limit="24">24H</button>
                        <button class="join-item btn btn-sm" data-timeframe="12HRS" data-limit="14">7D</button>
                        <button class="join-item btn btn-sm btn-active" data-timeframe="1DAY" data-limit="30">30D</button>
                    </div>
                </div>
                <div class="h-[400px] w-full">
                    <canvas id="priceChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Market Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Market Cap</h2>
                    <div class="stat">
                        <div class="stat-value text-primary" id="marketCap">...</div>
                        <div class="stat-desc" id="marketCapRank">...</div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Volume (24h)</h2>
                    <div class="stat">
                        <div class="stat-value text-secondary" id="volume24h">...</div>
                        <div class="stat-desc" id="volumeChange">...</div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Supply</h2>
                    <div class="stat">
                        <div class="stat-value text-accent" id="supply">...</div>
                        <div class="stat-desc" id="maxSupply">...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer p-10 bg-base-100 text-base-content mt-6">
        <div>
            <span class="footer-title">Juridisch</span> 
            <a href="services/Gebruikersvoorwaarden.html" class="link link-hover">Gebruikersvoorwaarden</a>
            <a href="services/Privacybeleid.html" class="link link-hover">Privacybeleid</a>
            <a href="services/cookiebeleid.html" class="link link-hover">Cookiebeleid</a>
        </div>
        <div>
            <span class="footer-title">Resources</span> 
            <a class="link link-hover">Market Analysis</a>
            <a class="link link-hover">Crypto Education</a>
            <a class="link link-hover">Community</a>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/compatibility.js') }}"></script>
    <script src="{{ asset('js/coin-details.js') }}"></script>
    
    <!-- Crypto AI Chatbot Component -->
    @include('components.crypto-chatbot-simple')
</body>
</html> 