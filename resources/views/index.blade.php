<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoQuest Dashboard</title>
    
    <!-- Tailwind CSS and DaisyUI -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-base-200 min-h-screen">
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
                        <li><a href="{{ route('home') }}" class="active">Home</a></li>
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
                    <li><a href="{{ route('home') }}" class="active">Home</a></li>
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
                            <li><a href="{{ route('profile.edit') }}">Profile</a></li>
                            <li><a>Settings</a></li> <? /* There is no settings page yet - TODO */ ?>
                            <li><a>Logout</a></li> <? /* There is no logout page yet - TODO */?>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="container mx-auto px-4 pt-24">
        <!-- Market Overview Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-globe-americas mr-2"></i>
                        Global Market Cap
                    </h2>
                    <div class="stat">
                        <div class="stat-value text-primary">$1.2T</div>
                        <div class="stat-desc text-green-500">
                            <i class="fas fa-arrow-up mr-1"></i>
                            2.45% (24h)
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-4">
                        <div class="text-center">
                            <div class="text-sm font-bold">BTC Dom</div>
                            <div class="text-primary">45.3%</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-bold">Trades</div>
                            <div class="text-secondary">1.5M</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-bold">Volume</div>
                            <div class="text-accent">$89B</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Cryptocurrencies -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-coins mr-2"></i>
                        Top Cryptocurrencies
                    </h2>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-2">
                                <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" class="w-8 h-8" />
                                <span>Bitcoin</span>
                            </div>
                            <div class="text-right">
                                <div>$45,678</div>
                                <div class="text-green-500 text-sm">+2.3%</div>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-2">
                                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum" class="w-8 h-8" />
                                <span>Ethereum</span>
                            </div>
                            <div class="text-right">
                                <div>$3,245</div>
                                <div class="text-red-500 text-sm">-1.2%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Portfolio Performance -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-wallet mr-2"></i>
                        Portfolio Performance
                    </h2>
                    <div class="stat">
                        <div class="stat-value text-secondary">$56,789</div>
                        <div class="stat-desc text-green-500">
                            <i class="fas fa-arrow-up mr-1"></i>
                            5.6% (24h)
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-4">
                        <div class="text-center">
                            <div class="text-sm font-bold">Coins</div>
                            <div class="text-primary">7</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-bold">Profit</div>
                            <div class="text-green-500">+$3,200</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm font-bold">Allocation</div>
                            <div class="text-accent">Diversified</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cryptocurrency Market Table -->
        <div class="card bg-base-100 shadow-xl mb-6">
            <div class="card-body p-2 sm:p-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 class="card-title">
                        <i class="fas fa-chart-line mr-2"></i>
                        Cryptocurrency Markets
                    </h2>
                    <div class="join w-full sm:w-auto">
                        <button class="btn btn-sm join-item btn-primary flex-1 sm:flex-none">Gainers</button>
                        <button class="btn btn-sm join-item flex-1 sm:flex-none">Losers</button>
                        <button class="btn btn-sm join-item flex-1 sm:flex-none">Volume</button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="table table-compact w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>24h Change</th>
                                <th>Market Cap</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>
                                    <div class="flex items-center space-x-3">
                                        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" class="w-8 h-8" />
                                        <div>
                                            <div class="font-bold">Bitcoin</div>
                                            <div class="text-sm opacity-50">BTC</div>
                                        </div>
                                    </div>
                                </td>
                                <td>$45,678</td>
                                <td className="text-green-500">+2.3%</td>
                                <td>$876B</td>
                                <td>
                                    <div className="flex items-center space-x-2">
                                        <button className="btn btn-xs btn-primary">
                                            <i className="fas fa-plus mr-1"></i>Track
                                        </button>
                                        <button className="btn btn-xs btn-ghost btn-square">
                                            <i className="fas fa-star text-yellow-500"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <!-- More cryptocurrency rows -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- News and Alerts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-newspaper mr-2"></i>
                        Market News
                    </h2>
                    <div class="space-y-4">
                        <div class="alert bg-base-200">
                            <div>
                                <h3 class="font-bold">Bitcoin Reaches New Milestone</h3>
                                <p class="text-xs">Major institutional investments drive crypto market growth</p>
                            </div>
                        </div>
                        <div class="alert bg-base-200">
                            <div>
                                <h3 class="font-bold">Ethereum Network Upgrade</h3>
                                <p class="text-xs">New scalability improvements announced</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-bell mr-2"></i>
                        Alerts & Actions
                    </h2>
                    <div class="space-y-2">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            <span>Bitcoin price approaching support level</span>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle mr-2"></i>
                            <span>New trading opportunity detected</span>
                        </div>
                        <div class="card-actions justify-end mt-4">
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-plus mr-1"></i>
                                Add Alert
                            </button>
                        </div>
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
    <script src="{{ asset('js/chart.js') }}"></script>
    <script src="{{ asset('js/gamification.js') }}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            initializeRealTimeUpdates();
        });
    </script>
</body>
</html>