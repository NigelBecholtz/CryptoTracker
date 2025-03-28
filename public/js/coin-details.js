/**
 * Coin Details Page JavaScript
 * Handles the interaction with the API to show cryptocurrency details
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Coin details page initialized');
    
    // Get coin ID from URL path
    let coinId = '';
    try {
        const pathParts = window.location.pathname.split('/');
        // Filter out empty strings
        const filteredParts = pathParts.filter(part => part.trim() !== '');
        // The last part should be the coin ID
        coinId = filteredParts[filteredParts.length - 1];
        console.log('Path parts:', filteredParts, 'Extracted coin ID:', coinId);
    } catch (error) {
        console.error('Error extracting coin ID from URL:', error);
    }
    
    if (!coinId) {
        showError('Coin ID is missing from the URL.');
        return;
    }
    
    // Convert coin ID to uppercase for consistency
    coinId = coinId.toUpperCase();
    console.log(`Loading details for coin: ${coinId}`);
    
    try {
        // Get main DOM elements
        const coinName = document.getElementById('coinName');
        const coinSymbol = document.getElementById('coinSymbol');
        const coinInitials = document.getElementById('coinInitials');
        const coinPrice = document.getElementById('coinPrice');
        const priceChange = document.getElementById('priceChange');
        const marketCap = document.getElementById('marketCap');
        const volume = document.getElementById('volume24h');
        const supply = document.getElementById('supply');
        const priceChart = document.getElementById('priceChart');
        const loadingIndicator = document.getElementById('loadingIndicator');
        
        // Show loading state
        if (loadingIndicator) {
            loadingIndicator.classList.remove('hidden');
        }
        
        // Get coin exchange rate (price)
        console.log(`Fetching price for ${coinId}`);
        const price = await CryptoAPI.getExchangeRates(coinId);
        console.log(`Price for ${coinId}: $${price}`);
        
        // Get price change percentage
        console.log(`Fetching price change for ${coinId}`);
        const change = await CryptoAPI.getPriceChange(coinId);
        console.log(`Price change for ${coinId}: ${change}%`);
        
        // Get asset details from cache or fallback
        const fallback = window.FALLBACK_DATA?.[coinId];
        let coinNameText = fallback?.name || coinId;
        
        // Populate the UI with the data
        if (coinName) coinName.textContent = coinNameText;
        if (coinSymbol) coinSymbol.textContent = coinId;
        
        // Set coin initials (first letter of each word in the name)
        if (coinInitials) {
            if (coinNameText.includes(' ')) {
                // For multi-word names, use first letter of each word
                const initials = coinNameText
                    .split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                coinInitials.textContent = initials;
            } else {
                // For single words, use first two letters
                coinInitials.textContent = coinId.slice(0, 2).toUpperCase();
            }
        }
        
        // Format price based on its magnitude
        if (coinPrice) coinPrice.textContent = formatPrice(price);
        
        // Show price change with proper color
        if (priceChange) {
            const changePrefix = change >= 0 ? '+' : '';
            priceChange.textContent = `${changePrefix}${change.toFixed(2)}%`;
            priceChange.className = change >= 0 ? 'text-success' : 'text-error';
        }
        
        // Set additional market data
        if (fallback) {
            if (marketCap) marketCap.textContent = '$' + formatMarketNumber(fallback.price_usd * fallback.supply);
            if (volume) volume.textContent = '$' + formatMarketNumber(fallback.volume_1day_usd);
            if (supply) supply.textContent = formatNumber(fallback.supply) + ' ' + coinId;
        } else {
            // If no fallback data, estimate values based on price
            // These are rough estimates for display purposes
            const estimatedSupply = getEstimatedSupply(coinId);
            if (marketCap) marketCap.textContent = '$' + formatMarketNumber(price * estimatedSupply);
            if (volume) volume.textContent = '$' + formatMarketNumber(price * estimatedSupply * 0.05); // Rough estimate
            if (supply) supply.textContent = formatNumber(estimatedSupply) + ' ' + coinId;
        }
        
        // Hide loading state
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        // Initialize price chart
        if (priceChart) {
            initializePriceChart(coinId, priceChart);
        } else {
            console.error('Price chart element not found');
        }
        
    } catch (error) {
        console.error('Error loading coin details:', error);
        showError('Failed to load coin details. Please try again later.');
        
        // Hide loading state
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
});

/**
 * Format price based on its magnitude
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
function formatPrice(price) {
    if (price === null || price === undefined) return '$0.00';
    
    if (price >= 1000) {
        return '$' + price.toLocaleString('en-US', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else if (price >= 1) {
        return '$' + price.toLocaleString('en-US', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        });
    } else {
        // For very small prices, show more decimal places
        return '$' + price.toLocaleString('en-US', { 
            minimumFractionDigits: 6,
            maximumFractionDigits: 8
        });
    }
}

/**
 * Format number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('en-US');
}

/**
 * Get estimated supply for a coin if not available
 * @param {string} coinId - Coin identifier
 * @returns {number} - Estimated supply
 */
function getEstimatedSupply(coinId) {
    // Default estimated supplies for common coins
    const estimatedSupplies = {
        'BTC': 19000000,
        'ETH': 120000000,
        'XRP': 45000000000,
        'LTC': 70000000,
        'BCH': 19000000,
        'BNB': 170000000,
        'DOT': 1000000000,
        'ADA': 33000000000,
        'SOL': 350000000,
        'DOGE': 130000000000
    };
    
    return estimatedSupplies[coinId] || 100000000; // Default to 100M if unknown
}

/**
 * Initialize the price chart
 * @param {string} coinId - Coin identifier
 * @param {HTMLElement} chartElement - Chart container element
 */
async function initializePriceChart(coinId, chartElement) {
    try {
        console.log(`Initializing price chart for ${coinId}`);
        
        // Try to get candle data for the chart
        let candles = [];
        
        try {
            // For Gemini API, we need to use the symbol format
            const symbol = coinId.toLowerCase() + 'usd';
            console.log(`Attempting to fetch candles for ${symbol}`);
            
            // Get 1-day candles for the past 30 days
            candles = await CryptoAPI.getCandles(symbol, '1day');
            console.log(`Got ${candles?.length || 0} candles for ${symbol}`);
        } catch (error) {
            console.error('Error fetching candle data:', error);
            console.log('Falling back to mock candle generation');
            
            // Generate mock candle data based on current price and change
            const price = await CryptoAPI.getExchangeRates(coinId);
            const change = await CryptoAPI.getPriceChange(coinId);
            candles = generateMockCandles(price, change);
        }
        
        if (!candles || candles.length === 0) {
            console.warn('No candle data available, generating mock data');
            const price = await CryptoAPI.getExchangeRates(coinId);
            const change = await CryptoAPI.getPriceChange(coinId);
            candles = generateMockCandles(price, change);
        }
        
        console.log(`Final candles data (${candles.length} items):`, candles.slice(0, 3));
        
        // Format data for Chart.js
        const chartData = formatCandleDataForChart(candles);
        console.log('Formatted chart data:', chartData);
        
        // Safety check
        if (!chartElement) {
            console.error('Chart canvas element not found');
            return;
        }
        
        // Get 2D context - this might fail if the element isn't a canvas
        let ctx;
        try {
            ctx = chartElement.getContext('2d');
        } catch (error) {
            console.error('Failed to get canvas context:', error);
            return;
        }
        
        // Destroy existing chart if any
        if (window.priceChart) {
            window.priceChart.destroy();
        }
        
        // Create the chart
        window.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: `${coinId} Price (USD)`,
                    data: chartData.prices,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + formatMarketNumber(value, 2, false);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.raw.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Error initializing price chart:', error);
        showError('Failed to load price chart. Please try again later.', 'warning');
    }
}

/**
 * Format candle data for Chart.js
 * @param {Array} candles - Array of candle data
 * @returns {Object} - Formatted data for Chart.js
 */
function formatCandleDataForChart(candles) {
    if (!candles || !Array.isArray(candles) || candles.length === 0) {
        console.error('Invalid candle data', candles);
        return { labels: [], prices: [] };
    }
    
    const labels = [];
    const prices = [];
    
    try {
        // Sort candles by timestamp (oldest first)
        candles.sort((a, b) => {
            // Handle different timestamp formats
            const timestampA = typeof a.timestamp === 'number' ? a.timestamp : Date.parse(a.timestamp);
            const timestampB = typeof b.timestamp === 'number' ? b.timestamp : Date.parse(b.timestamp);
            return timestampA - timestampB;
        });
        
        candles.forEach(candle => {
            try {
                let timestamp = candle.timestamp;
                if (typeof timestamp === 'string') {
                    timestamp = Date.parse(timestamp);
                }
                
                const date = new Date(timestamp);
                
                // Format date as MM/DD
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const formattedDate = `${month}/${day}`;
                
                labels.push(formattedDate);
                prices.push(parseFloat(candle.close));
            } catch (e) {
                console.warn('Error processing candle data:', e, candle);
            }
        });
    } catch (error) {
        console.error('Error formatting candle data:', error);
    }
    
    return { labels, prices };
}

/**
 * Generate mock candle data based on current price and change
 * @param {number} currentPrice - Current price
 * @param {number} percentChange - 24-hour percent change
 * @returns {Array} - Array of mock candle data
 */
function generateMockCandles(currentPrice, percentChange) {
    const candles = [];
    const days = 30; // Generate 30 days of data
    
    // Estimate starting price based on current price and percent change
    const startingPrice = currentPrice / (1 + (percentChange / 100));
    
    // Generate a realistic price pattern
    for (let i = 0; i < days; i++) {
        const progress = i / (days - 1); // 0 to 1
        
        // Base price trend from start to current
        let price = startingPrice + (currentPrice - startingPrice) * progress;
        
        // Add some random variation to make it look realistic
        // More variation earlier, less variation later (to match the current price)
        const randomFactor = 0.05 * (1 - progress); // Max 5% variation at the start
        const randomVariation = (Math.random() * 2 - 1) * randomFactor;
        
        price = price * (1 + randomVariation);
        
        // Make sure the last candle matches the current price exactly
        if (i === days - 1) {
            price = currentPrice;
        }
        
        // Create candle data (simplified version)
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        
        candles.push({
            timestamp: date.getTime(),
            open: price * 0.998,
            high: price * 1.005,
            low: price * 0.995,
            close: price,
            volume: price * 1000 * (0.8 + Math.random() * 0.4) // Mock volume
        });
    }
    
    return candles;
}

/**
 * Format market numbers to human-readable format
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @param {boolean} withSymbol - Whether to include $ symbol
 * @returns {string} - Formatted market number
 */
function formatMarketNumber(value, decimals = 2, withSymbol = false) {
    if (value === null || value === undefined) return withSymbol ? '$0' : '0';
    
    let formattedValue;
    
    if (value >= 1e12) {
        formattedValue = (value / 1e12).toFixed(decimals) + 'T';
    } else if (value >= 1e9) {
        formattedValue = (value / 1e9).toFixed(decimals) + 'B';
    } else if (value >= 1e6) {
        formattedValue = (value / 1e6).toFixed(decimals) + 'M';
    } else if (value >= 1e3) {
        formattedValue = (value / 1e3).toFixed(decimals) + 'K';
    } else {
        formattedValue = value.toFixed(decimals);
    }
    
    return withSymbol ? '$' + formattedValue : formattedValue;
}

/**
 * Display error message
 * @param {string} message - Error message
 * @param {string} type - Error type (error, warning, info)
 */
function showError(message, type = 'error') {
    console.error(message);
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} mt-4`;
    alertElement.innerHTML = `
        <span>${message}</span>
        <button class="btn btn-sm btn-ghost" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    // Add to error container
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.appendChild(alertElement);
    } else {
        // Fallback to container if errorContainer doesn't exist
        const container = document.querySelector('.container');
        if (container) {
            container.prepend(alertElement);
        }
    }
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertElement.parentElement) {
            alertElement.remove();
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const buyForm = document.getElementById('buyForm');
    const investAmount = document.getElementById('investAmount');
    const coinAmountDisplay = document.getElementById('coinAmount');
    const currentPrice = parseFloat(document.getElementById('currentPrice').dataset.price);

    investAmount.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        const coinAmount = amount / currentPrice;
        coinAmountDisplay.textContent = coinAmount.toFixed(8);
    });

    buyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/investments/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
                },
                body: JSON.stringify({
                    crypto_symbol: coinSymbol,
                    amount: parseFloat(investAmount.value)
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                window.location.href = '/portfolio';
            } else {
                alert(data.error || 'Failed to make purchase');
            }
        } catch (error) {
            alert('Failed to process transaction');
        }
    });
});