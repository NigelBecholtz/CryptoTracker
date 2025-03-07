<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoQuest Portfolio</title>
    
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
                <!-- Add mobile menu drawer -->
                <div class="dropdown lg:hidden">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                        <i class="fas fa-bars"></i>
                    </div>
                    <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                        <li><a href="{{ route('markets') }}">Markets</a></li>
                        <li><a href="{{ route('portfolio') }}" class="active">Portfolio</a></li>
                    </ul>
                </div>
                <a href="{{ route('landing') }}" class="btn btn-ghost text-xl">
                    <i class="fas fa-chart-line mr-2"></i>
                    <span class="hidden sm:inline">CryptoTracker</span>
                </a>
            </div>
            <div class="navbar-center hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                    <li><a href="{{ route('markets') }}">Markets</a></li>
                    <li><a href="{{ route('portfolio') }}" class="active">Portfolio</a></li>
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
                                <img alt="User Avatar" src="https://avatars.dicebear.com/api/avataaars/cryptouser.svg" />
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

    <!-- Main Portfolio Content -->
    <div class="container mx-auto px-4 pt-24">
        <!-- Portfolio Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-dollar-sign mr-2"></i>
                        Total Balance
                    </h2>
                    <div class="stat">
                        <div class="stat-value text-primary">$10,000</div>
                        <div class="stat-desc text-green-500">
                            <i class="fas fa-arrow-up mr-1"></i>
                            5.6% (24h)
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-chart-line mr-2"></i>
                        Portfolio Value
                    </h2>
                    <div class="stat">
                        <div class="stat-value text-secondary">$10,500</div>
                        <div class="stat-desc text-green-500">
                            <i class="fas fa-arrow-up mr-1"></i>
                            6.2% (7d)
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">
                        <i class="fas fa-coins mr-2"></i>
                        Coins Held
                    </h2>
                    <div class="stat">
                        <div class="stat-value text-accent">3</div>
                        <div class="stat-desc">Unique Cryptocurrencies</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cryptocurrency Holdings -->
        <div class="card bg-base-100 shadow-xl mb-6">
            <div class="card-body p-2 sm:p-6">
                <h2 class="card-title mb-4">
                    <i class="fas fa-chart-pie mr-2"></i>
                    Your Cryptocurrency Holdings
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Coin 1: LearnCoin -->
                    <div class="card bg-base-200 shadow-md">
                        <div class="card-body">
                            <div class="flex justify-between items-center">
                                <h3 class="card-title">LearnCoin</h3>
                                <span class="badge badge-primary">LRN</span>
                            </div>
                            <div class="stat px-0">
                                <div class="stat-value text-primary">500 LRN</div>
                                <div class="stat-desc">$5,000</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-green-500">
                                    <i class="fas fa-arrow-up mr-1"></i>
                                    +3.2%
                                </span>
                                <button class="btn btn-sm btn-outline btn-primary">
                                    Trade
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Coin 2: EduToken -->
                    <div class="card bg-base-200 shadow-md">
                        <div class="card-body">
                            <div class="flex justify-between items-center">
                                <h3 class="card-title">EduToken</h3>
                                <span class="badge badge-secondary">EDU</span>
                            </div>
                            <div class="stat px-0">
                                <div class="stat-value text-secondary">250 EDU</div>
                                <div class="stat-desc">$2,500</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-red-500">
                                    <i class="fas fa-arrow-down mr-1"></i>
                                    -1.5%
                                </span>
                                <button class="btn btn-sm btn-outline btn-secondary">
                                    Trade
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Coin 3: QuestCoin -->
                    <div class="card bg-base-200 shadow-md">
                        <div class="card-body">
                            <div class="flex justify-between items-center">
                                <h3 class="card-title">QuestCoin</h3>
                                <span class="badge badge-accent">QST</span>
                            </div>
                            <div class="stat px-0">
                                <div class="stat-value text-accent">750 QST</div>
                                <div class="stat-desc">$3,000</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-green-500">
                                    <i class="fas fa-arrow-up mr-1"></i>
                                    +2.7%
                                </span>
                                <button class="btn btn-sm btn-outline btn-accent">
                                    Trade
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Trading Education Section -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-2 sm:p-6">
                <h2 class="card-title mb-4">
                    <i class="fas fa-graduation-cap mr-2"></i>
                    Trading Learning Path
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="card bg-base-200 shadow-md">
                        <div class="card-body">
                            <h3 class="card-title">Beginner</h3>
                            <p class="text-sm">Learn the basics of cryptocurrency trading</p>
                            <progress class="progress progress-primary w-full" value="30" max="100"></progress>
                            <button class="btn btn-primary btn-sm mt-2">Start Course</button>
                        </div>
                    </div>
                    <div class="card bg-base-200 shadow-md">
                        <div class="card-body">
                            <h3 class="card-title">Intermediate</h3>
                            <p class="text-sm">Advanced trading strategies and analysis</p>
                            <progress class="progress progress-secondary w-full" value="0" max="100"></progress>
                            <button class="btn btn-secondary btn-sm mt-2" disabled>Locked</button>
                        </div>
                    </div>
                    <div class="card bg-base-200 shadow-md">
                        <div class="card-body">
                            <h3 class="card-title">Expert</h3>
                            <p class="text-sm">Master complex trading techniques</p>
                            <progress class="progress progress-accent w-full" value="0" max="100"></progress>
                            <button class="btn btn-accent btn-sm mt-2" disabled>Locked</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
    <!-- Add this just before the closing body tag -->
    <dialog id="trade_modal" class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">
                Trade <span id="trading_coin_name">Coin</span>
                <span id="trading_coin_symbol" class="badge badge-primary ml-2">SYM</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Market Info -->
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <h4 class="font-semibold mb-2">Market Info</h4>
                        <!-- Add price chart -->
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
                                <span id="trading_price_change" class="font-mono text-green-500">+0.00%</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Available Balance:</span>
                                <span id="trading_available_balance" class="font-mono">0.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trading Form -->
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <div class="join w-full mb-4">
                            <button class="btn join-item flex-1" onclick="setTradeType('buy')">Buy</button>
                            <button class="btn join-item flex-1" onclick="setTradeType('sell')">Sell</button>
                        </div>
                        
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Amount</span>
                                <span class="label-text-alt">Max: <span id="trading_max_amount">0.00</span></span>
                            </label>
                            <input type="number" id="trading_amount" placeholder="Enter amount" class="input input-bordered w-full" />
                            <label class="label">
                                <span class="label-text-alt">Total: $<span id="trading_total">0.00</span></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Preview -->
            <div class="alert mt-4">
                <div>
                    <h4 class="font-semibold">Order Preview</h4>
                    <p class="text-sm" id="order_preview">Enter an amount to preview your trade</p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-action">
                <button class="btn btn-primary" onclick="executeTrade()">
                    <i class="fas fa-check mr-2"></i>Confirm Trade
                </button>
                <button class="btn" onclick="closeTradeModal()">Cancel</button>
            </div>
        </div>
    </dialog>

    <!-- Add the trading script -->
    <script>
        let currentTradeType = 'buy';
        let currentCoin = null;

        // Fake market data
        const coinData = {
            'LRN': { 
                price: 10.00, 
                change: 3.2, 
                balance: 500,
                priceHistory: [9.50, 9.80, 9.70, 9.90, 10.10, 9.95, 10.00]
            },
            'EDU': { 
                price: 10.00, 
                change: -1.5, 
                balance: 250,
                priceHistory: [10.20, 10.15, 10.10, 10.05, 9.95, 9.90, 10.00]
            },
            'QST': { 
                price: 4.00, 
                change: 2.7, 
                balance: 750,
                priceHistory: [3.80, 3.85, 3.90, 3.95, 4.10, 4.05, 4.00]
            }
        };

        let priceChart = null;

        function openTradeModal(coin) {
            currentCoin = coin;
            const modal = document.getElementById('trade_modal');
            const data = coinData[coin.symbol];

            // Update modal content
            document.getElementById('trading_coin_name').textContent = coin.name;
            document.getElementById('trading_coin_symbol').textContent = coin.symbol;
            document.getElementById('trading_current_price').textContent = `$${data.price.toFixed(2)}`;
            document.getElementById('trading_price_change').textContent = `${data.change > 0 ? '+' : ''}${data.change}%`;
            document.getElementById('trading_available_balance').textContent = `${data.balance} ${coin.symbol}`;
            
            // Update price chart
            updatePriceChart(data.priceHistory, coin.symbol, data.change > 0);
            
            // Reset form
            document.getElementById('trading_amount').value = '';
            updateOrderPreview();
            
            // Show modal
            modal.showModal();
        }

        function updatePriceChart(priceHistory, symbol, isPositive) {
            // Destroy existing chart if it exists
            if (priceChart) {
                priceChart.destroy();
            }

            const ctx = document.getElementById('priceChart').getContext('2d');
            
            // Generate labels for the last 7 days
            const labels = Array.from({length: 7}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });

            priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${symbol} Price`,
                        data: priceHistory,
                        borderColor: isPositive ? '#4ade80' : '#ef4444',
                        backgroundColor: isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: isPositive ? '#4ade80' : '#ef4444'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        function closeTradeModal() {
            // Destroy chart when closing modal
            if (priceChart) {
                priceChart.destroy();
                priceChart = null;
            }
            document.getElementById('trade_modal').close();
        }

        function setTradeType(type) {
            currentTradeType = type;
            updateOrderPreview();
            
            // Update UI
            const buttons = document.querySelector('.join').children;
            Array.from(buttons).forEach(btn => {
                btn.classList.toggle('btn-primary', btn.textContent.toLowerCase() === type);
            });
        }

        function updateOrderPreview() {
            const amount = parseFloat(document.getElementById('trading_amount').value) || 0;
            const price = coinData[currentCoin?.symbol]?.price || 0;
            const total = amount * price;
            
            document.getElementById('trading_total').textContent = total.toFixed(2);
            
            const preview = document.getElementById('order_preview');
            if (amount <= 0) {
                preview.textContent = 'Enter an amount to preview your trade';
                return;
            }

            preview.textContent = `You will ${currentTradeType} ${amount} ${currentCoin?.symbol} for $${total.toFixed(2)}`;
        }

        function executeTrade() {
            const amount = parseFloat(document.getElementById('trading_amount').value) || 0;
            if (amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            // Simulate trade execution
            alert(`Trade executed successfully! ${currentTradeType.toUpperCase()}: ${amount} ${currentCoin.symbol}`);
            closeTradeModal();
        }

        // Add event listeners when document loads
        document.addEventListener('DOMContentLoaded', () => {
            // Trade buttons
            const tradeButtons = document.querySelectorAll('button[class*="btn-outline"]');
            
            tradeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const card = button.closest('.card');
                    const coinName = card.querySelector('.card-title').textContent;
                    const coinSymbol = card.querySelector('.badge').textContent;
                    
                    openTradeModal({ name: coinName, symbol: coinSymbol });
                });
            });

            // Amount input
            const amountInput = document.getElementById('trading_amount');
            if (amountInput) {
                amountInput.addEventListener('input', updateOrderPreview);
            }
        });
    </script>
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/chart.js') }}"></script>
    <script src="{{ asset('js/gamification.js') }}"></script>
</body>
</html>