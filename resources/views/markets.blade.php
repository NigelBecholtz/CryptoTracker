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
                    @auth
                        <!-- Wallet Balance -->
                        <div class="hidden sm:flex items-center gap-2">
                            <i class="fas fa-wallet text-primary"></i>
                            <span class="text-primary font-semibold wallet-balance">€{{ number_format(Auth::user()->wallet_balance, 2) }}</span>
                        </div>
                    @endauth
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

    <!-- Add this right after the navbar, before the main content wrapper -->
    <div class="container mx-auto px-4 pt-20">
        @if(session('success'))
            <div class="alert alert-success mb-4" data-wallet-balance="{{ session('wallet_balance') }}">
                <i class="fas fa-check-circle mr-2"></i>
                {{ session('success') }}
            </div>
        @endif
        
        @if(session('error'))
            <div class="alert alert-error mb-4">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ session('error') }}
            </div>
        @endif
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

    <!-- Trading Modal -->
    <dialog id="trade_modal" class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">
                Buy <span id="trading_coin_name">Coin</span>
                <span id="trading_coin_symbol" class="badge badge-primary ml-2">SYM</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Market Info -->
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <h4 class="font-semibold mb-2">Market Info</h4>
                        <!-- Price chart -->
                        <div class="mb-4 h-[200px]">
                            <canvas id="priceChart"></canvas>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Current Price:</span>
                                <span id="trading_current_price" class="font-mono">$0.00</span>
                            </div>
                            <div class="flex justify-between">
                                <span>24h Change:</span>
                                <span id="trading_price_change" class="font-mono">+0.00%</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Your Wallet Balance:</span>
                                <span id="trading_available_balance" class="font-mono">€0.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trading Form -->
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <h4 class="font-semibold mb-2">Buy Crypto</h4>
                        
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Amount to Buy (€)</span>
                                <span class="label-text-alt">Max: <span id="trading_max_amount">0.00</span></span>
                            </label>
                            <input type="number" id="trading_amount" placeholder="Enter amount in EUR" class="input input-bordered w-full" />
                            <label class="label">
                                <span class="label-text-alt">You will receive: <span id="trading_receive_amount">0.00</span> <span id="trading_receive_symbol">BTC</span></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Preview -->
            <div class="alert mt-4">
                <div>
                    <h4 class="font-semibold">Order Preview</h4>
                    <p class="text-sm" id="order_preview">Enter an amount to preview your purchase</p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-action">
                <form method="POST" action="{{ route('buy.crypto') }}" id="buy-form">
                    @csrf
                    <input type="hidden" name="coin_symbol" id="buy_coin_symbol" value="">
                    <input type="hidden" name="amount" id="buy_amount" value="">
                    <input type="hidden" name="price" id="buy_price" value="">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check mr-2"></i>Confirm Purchase
                    </button>
                </form>
                <button class="btn" onclick="closeTradeModal()">Cancel</button>
            </div>
        </div>
    </dialog>

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
    <script src="{{ asset('js/CoinbaseWebSocket.js') }}"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/compatibility.js') }}"></script>
    <script src="{{ asset('js/markets.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Trading Modal Script -->
    <script>
        let currentCoin = null;
        let priceChart = null;
        
        // Add this function to safely update market overview data
        async function updateMarketOverview() {
            try {
                const assets = await CryptoAPI.getAssets();
                if (!assets || !Array.isArray(assets) || assets.length === 0) {
                    console.warn('No valid asset data received');
                    return; // Don't update if we don't have valid data
                }

                // Calculate total market cap and 24h volume
                const cryptoAssets = assets.filter(asset => asset.type_is_crypto === 1);
                
                if (cryptoAssets.length === 0) {
                    console.warn('No crypto assets found in data');
                    return;
                }
                
                const totalMarketCap = cryptoAssets
                    .reduce((sum, asset) => sum + (asset.market_cap_usd || 0), 0);
                    
                const totalVolume = cryptoAssets
                    .reduce((sum, asset) => sum + (asset.volume_1day_usd || 0), 0);

                // Calculate average percentage change
                const assetsWithChange = cryptoAssets.filter(asset => 
                    asset.price_usd_change_percent_24h !== undefined && 
                    asset.price_usd_change_percent_24h !== null
                );
                
                const avgChange = assetsWithChange.length > 0 
                    ? assetsWithChange.reduce((sum, asset) => sum + asset.price_usd_change_percent_24h, 0) / assetsWithChange.length 
                    : 0;

                // Only update DOM if we have valid values
                if (totalMarketCap > 0) {
                    const marketCapElement = document.getElementById('total-market-cap');
                    if (marketCapElement) {
                        marketCapElement.textContent = `$${formatLargeNumber(totalMarketCap)}`;
                    }
                }
                
                if (totalVolume > 0) {
                    const volumeElement = document.getElementById('total-volume');
                    if (volumeElement) {
                        volumeElement.textContent = `$${formatLargeNumber(totalVolume)}`;
                    }
                }
                
                const avgPercentElement = document.getElementById('avg-percent-change');
                if (avgPercentElement) {
                    avgPercentElement.innerHTML = `
                        <div class="flex items-center gap-1">
                            <i class="fas fa-${avgChange >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                            <span>${Math.abs(avgChange).toFixed(2)}% (24h)</span>
                        </div>
                    `;
                    avgPercentElement.className = `stat-desc ${avgChange >= 0 ? 'text-success' : 'text-error'}`;
                }
                
                // Update active cryptocurrencies count
                const cryptoCountElement = document.querySelector('.stat-value.text-accent');
                if (cryptoCountElement) {
                    cryptoCountElement.textContent = cryptoAssets.length.toLocaleString();
                }
            } catch (error) {
                console.error('Error updating market overview:', error);
                // Don't update UI on error - keep existing values
            }
        }
        
        // Helper function to format large numbers with T, B, M suffixes
        function formatLargeNumber(num) {
            if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
            if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
            if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
            return num.toLocaleString();
        }
        
        // Call this function when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            updateMarketOverview();
            // Call it again every 5 minutes
            setInterval(updateMarketOverview, 5 * 60 * 1000);
        });

        function openTradeModal(coin) {
            currentCoin = coin;
            
            // Update modal content
            document.getElementById('trading_coin_name').textContent = coin.name;
            document.getElementById('trading_coin_symbol').textContent = coin.symbol;
            document.getElementById('trading_current_price').textContent = '$' + parseFloat(coin.price).toLocaleString();
            
            // Set price change with color
            const priceChangeElement = document.getElementById('trading_price_change');
            const priceChange = parseFloat(coin.change);
            priceChangeElement.textContent = (priceChange >= 0 ? '+' : '') + priceChange.toFixed(2) + '%';
            priceChangeElement.className = 'font-mono ' + (priceChange >= 0 ? 'text-success' : 'text-error');
            
            // Set wallet balance
            @auth
                const walletBalance = {{ Auth::user()->wallet_balance }};
                document.getElementById('trading_available_balance').textContent = '€' + walletBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                document.getElementById('trading_max_amount').textContent = walletBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            @else
                document.getElementById('trading_available_balance').textContent = '€0.00';
                document.getElementById('trading_max_amount').textContent = '0.00';
            @endauth
            
            document.getElementById('trading_receive_symbol').textContent = coin.symbol;
            
            // Set form hidden values
            document.getElementById('buy_coin_symbol').value = coin.symbol;
            
            // Initialize chart
            initPriceChart(coin.symbol);
            
            // Show modal
            document.getElementById('trade_modal').showModal();
        }
        
        function closeTradeModal() {
            document.getElementById('trade_modal').close();
            
            // Destroy chart to prevent memory leaks
            if (priceChart) {
                priceChart.destroy();
                priceChart = null;
            }
        }
        
        function initPriceChart(symbol) {
            const ctx = document.getElementById('priceChart').getContext('2d');
            
            // Destroy existing chart if it exists
            if (priceChart) {
                priceChart.destroy();
            }
            
            // Sample data - in a real app, you would fetch historical data
            const labels = Array.from({length: 24}, (_, i) => {
                const d = new Date();
                d.setHours(d.getHours() - 24 + i);
                return d.getHours() + ':00';
            });
            
            // Generate some random price data based on current price
            const currentPrice = parseFloat(currentCoin.price);
            const data = Array.from({length: 24}, () => {
                return currentPrice * (0.95 + Math.random() * 0.1);
            });
            
            // Create chart
            priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${symbol} Price (USD)`,
                        data: data,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '$' + context.parsed.y.toFixed(2);
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });
        }
        
        function updateOrderPreview() {
            const amount = parseFloat(document.getElementById('trading_amount').value) || 0;
            const price = parseFloat(currentCoin.price);
            
            // Calculate how much crypto they will receive
            const receiveAmount = amount / price;
            document.getElementById('trading_receive_amount').textContent = receiveAmount.toFixed(8);
            
            // Update hidden form field
            document.getElementById('buy_amount').value = amount;
            document.getElementById('buy_price').value = price;
            
            // Update preview
            const preview = document.getElementById('order_preview');
            if (amount <= 0) {
                preview.textContent = 'Enter an amount to preview your purchase';
                return;
            }
            
            preview.textContent = `You will buy ${receiveAmount.toFixed(8)} ${currentCoin.symbol} for €${amount.toFixed(2)}`;
        }
        
        // Add event listeners when document loads
        document.addEventListener('DOMContentLoaded', () => {
            const amountInput = document.getElementById('trading_amount');
            if (amountInput) {
                amountInput.addEventListener('input', updateOrderPreview);
            }
        });
    </script>

    <!-- Crypto AI Chatbot Component -->
    @include('components.crypto-chatbot-simple')
    <!-- Add this before the closing body tag -->
    <script src="{{ asset('js/wallet.js') }}"></script>
    </body>
    </html>