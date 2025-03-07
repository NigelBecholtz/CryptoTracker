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
                       <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                       <li><a href="{{ route('markets') }}">Markets</a></li>
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
                   <li><a href="{{ route('dashboard') }}">Dashboard</a></li>
                   <li><a href="{{ route('markets') }}">Markets</a></li>
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

    <!-- Main Content -->
    <div class="container mx-auto px-4 pt-24">
        <!-- Loading Indicator -->
        <div id="loadingIndicator" class="fixed top-0 left-0 right-0 bottom-0 bg-base-200 bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="loading loading-spinner loading-lg"></div>
        </div>

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
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/chart.js') }}"></script>
    <script>
        let currentCoin = null;
        let priceChart = null;
        let currentTimeframe = {
            periodId: '1DAY',
            limit: 30
        };

        // Helper function to format numbers
        function formatNumber(number) {
            if (number >= 1e12) return (number / 1e12).toFixed(2) + 'T';
            if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
            if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
            if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
            return number.toFixed(2);
        }

        // Get coin symbol from URL
        const coinSymbol = '{{ $symbol }}';

        // Initialize chart
        function initChart() {
            const ctx = document.getElementById('priceChart').getContext('2d');
            priceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Price (USD)',
                        data: [],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        pointHitRadius: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 8,
                                maxRotation: 0
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return '$' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        async function loadCoinDetails() {
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) loadingIndicator.classList.remove('hidden');

            try {
                // Get asset details
                const asset = await CryptoAPI.getAsset(coinSymbol);
                if (!asset) {
                    throw new Error('Coin not found');
                }

                // Get current exchange rate and OHLCV data in parallel
                const [exchangeRate, ohlcvData] = await Promise.all([
                    CryptoAPI.getExchangeRates(coinSymbol),
                    CryptoAPI.getOHLCV(coinSymbol, currentTimeframe.periodId, currentTimeframe.limit)
                ]);

                // Update asset with exchange rate
                if (exchangeRate) {
                    asset.price_usd = exchangeRate.rate;
                }

                // Get 24h price change
                const priceChange = await CryptoAPI.getPriceChange(coinSymbol);
                if (priceChange !== null) {
                    asset.price_usd_change_percent_24h = priceChange;
                }

                currentCoin = asset;
                updateUI(asset);
                
                if (ohlcvData && Array.isArray(ohlcvData)) {
                    updatePriceChart(ohlcvData);
                }
            } catch (error) {
                console.error('Error loading coin details:', error);
                showError('Error loading coin data. Please try again later.');
            } finally {
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
            }
        }

        function updateUI(asset) {
            if (!asset) return;

            // Update page title and header
            document.title = `${asset.name} (${asset.asset_id}) - CryptoTracker`;
            
            // Get current price from exchange rate
            const currentPrice = asset.price_usd || 0;
            
            // Calculate market cap (price * supply)
            const marketCap = currentPrice * (asset.supply || 0);
            
            // Calculate 24h volume
            const volume24h = asset.volume_1day_usd || 0;
            
            // Calculate price change
            const priceChange = asset.price_usd_change_percent_24h || 0;
            
            const elements = {
                coinName: asset.name || 'N/A',
                coinSymbol: asset.asset_id || 'N/A',
                coinInitials: asset.asset_id?.substring(0, 2) || 'XX',
                coinPrice: `$${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                marketCap: `$${formatNumber(marketCap)}`,
                volume24h: `$${formatNumber(volume24h)}`,
                supply: formatNumber(asset.supply || 0),
                marketCapRank: `Rank #${asset.rank || 'N/A'}`,
                maxSupply: asset.max_supply ? `Max: ${formatNumber(asset.max_supply)}` : 'No max supply'
            };

            // Update all elements with null checks
            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });

            // Update price change
            const priceChangeElement = document.getElementById('priceChange');
            if (priceChangeElement) {
                priceChangeElement.innerHTML = `
                    <span class="${priceChange >= 0 ? 'text-success' : 'text-error'}">
                        <i class="fas fa-${priceChange >= 0 ? 'arrow-up' : 'arrow-down'} mr-1"></i>
                        ${priceChange >= 0 ? '+' : ''}${Math.abs(priceChange).toFixed(2)}%
                    </span>
                `;
            }

            // Update volume change
            const volumeChange = asset.volume_1day_usd_change_percent || 0;
            const volumeChangeElement = document.getElementById('volumeChange');
            if (volumeChangeElement) {
                volumeChangeElement.innerHTML = `
                    <span class="${volumeChange >= 0 ? 'text-success' : 'text-error'}">
                        <i class="fas fa-${volumeChange >= 0 ? 'arrow-up' : 'arrow-down'} mr-1"></i>
                        ${volumeChange >= 0 ? '+' : ''}${Math.abs(volumeChange).toFixed(2)}%
                    </span>
                `;
            }
        }

        function updatePriceChart(ohlcvData) {
            if (!currentCoin || !priceChart) return;

            // Sort data by time
            const sortedData = [...ohlcvData].sort((a, b) => 
                new Date(a.time_period_start) - new Date(b.time_period_start)
            );

            const labels = sortedData.map(d => {
                const date = new Date(d.time_period_start);
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit'
                });
            });

            const prices = sortedData.map(d => d.rate_open);

            // Update chart with new data
            priceChart.data.labels = labels;
            priceChart.data.datasets[0].data = prices;
            priceChart.data.datasets[0].borderColor = prices[prices.length - 1] >= prices[0] ? 
                'rgb(75, 192, 192)' : 'rgb(239, 68, 68)';
            priceChart.update();
        }

        function showError(message) {
            const errorHtml = `
                <div class="alert alert-error mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                </div>
            `;
            
            const container = document.querySelector('.container');
            if (container) {
                container.insertAdjacentHTML('afterbegin', errorHtml);
            }
        }

        // Event listeners for timeframe buttons
        document.querySelectorAll('[data-timeframe]').forEach(button => {
            button.addEventListener('click', async () => {
                const periodId = button.dataset.timeframe;
                const limit = parseInt(button.dataset.limit);
                
                // Update active state
                document.querySelectorAll('[data-timeframe]').forEach(btn => 
                    btn.classList.remove('btn-active'));
                button.classList.add('btn-active');
                
                // Update timeframe
                currentTimeframe = { periodId, limit };
                
                // Reload data
                await loadCoinDetails();
            });
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            initChart();
            loadCoinDetails();
            
            // Refresh data every minute
            setInterval(loadCoinDetails, 60000);
        });
    </script>
</body>
</html> 