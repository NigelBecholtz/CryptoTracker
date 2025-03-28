<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoQuest Markets</title>
    
    <!-- Tailwind CSS and DaisyUI -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-base-200 min-h-screen flex flex-col">
    <!-- Navigation -->
    <div class="fixed top-0 left-0 right-0 z-50">
        <div class="navbar bg-base-100 shadow-xl">
            <div class="navbar-start">
                <!-- Add mobile menu drawer -->
                <div class="dropdown lg:hidden">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                        <i class="fas fa-bars"></i>
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="{{ route('home') }}">Home</a></li>
                        <li><a href="{{ route('market') }}" class="active">Market</a></li>
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
                    <li><a href="{{ route('market') }}" class="active">Market</a></li>
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
                        <li><a href="{{ route('profile.edit') }}">Profile</a></li>
                            <li><a>Settings</a></li> <? /* There is no settings page yet - TODO */ ?>
                            <li>
                            <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <a href="{{ route('logout') }}" onclick="event.preventDefault(); this.closest('form').submit();">
                                        Logout
                                    </a>
                                </form>
                            </li> 
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main content wrapper -->
    <div class="flex-grow">
        <!-- Main Markets Content -->
        <div class="container mx-auto px-4 pt-24">
            <!-- Market Overview Section -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <i class="fas fa-globe-americas mr-2"></i>
                            Global Market Cap
                        </h2>
                        <div class="stat">
                            <div id="total-market-cap" class="stat-value text-primary">$1.2T</div>
                            <div id="avg-percent-change" class="stat-desc text-success">
                                <div class="flex items-center gap-1">
                                    <i class="fas fa-arrow-up"></i>
                                    <span>+2.45% (24h)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <i class="fas fa-chart-line mr-2"></i>
                            Total Volume
                        </h2>
                        <div class="stat">
                            <div id="total-volume" class="stat-value text-secondary">$89B</div>
                            <div class="stat-desc text-success">
                                <div class="flex items-center gap-1">
                                    <i class="fas fa-arrow-up"></i>
                                    <span>+1.8% (24h)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">
                            <i class="fas fa-coins mr-2"></i>
                            Active Cryptocurrencies
                        </h2>
                        <div class="stat">
                            <div class="stat-value text-accent">12,345</div>
                            <div class="stat-desc">Total unique coins</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cryptocurrency Markets Table -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h2 class="card-title">
                            <i class="fas fa-chart-line mr-2"></i>
                            Cryptocurrency Markets
                        </h2>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                            <!-- Loading indicator -->
                            <div id="loading-indicator" class="hidden">
                                <span class="loading loading-spinner loading-md"></span>
                            </div>
                            <!-- Search Bar -->
                            <div class="form-control w-full sm:w-64">
                                <div class="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search Cryptocurrencies" 
                                        class="input input-bordered input-sm w-full pr-10" 
                                        id="market-search"
                                    />
                                    <button class="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th class="hidden sm:table-cell">#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th class="hidden sm:table-cell">24h Change</th>
                                    <th class="hidden md:table-cell">Market Cap</th>
                                    <th class="hidden lg:table-cell">Volume (24h)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="markets-table-body">
                                <!-- Loading placeholder -->
                                <tr id="loading-placeholder">
                                    <td colspan="7" class="text-center py-4">
                                        <span class="loading loading-spinner loading-lg"></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer - aangepaste styling -->
    <footer class="footer p-10 bg-base-100 text-base-content mt-auto">
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
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/compatibility.js') }}"></script>
    <script src="{{ asset('js/markets.js') }}"></script>

    <!-- Crypto AI Chatbot Component -->
    @include('components.crypto-chatbot-simple')
</body>
</html>