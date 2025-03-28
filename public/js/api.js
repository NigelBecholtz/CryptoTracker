// Initialize WebSocket connection
let coinbaseWebSocket = null;
let marketData = new Map();
let isInitialized = false;

class CryptoAPI {
    static initialize() {
        if (!isInitialized) {
            coinbaseWebSocket = new CoinbaseWebSocket();
            coinbaseWebSocket.connect();
            
            // Listen for ticker updates
            window.addEventListener('coinbaseTicker', (event) => {
                const data = event.detail;
                marketData.set(data.product_id, {
                    ...marketData.get(data.product_id),
                    ...data,
                    price_usd: data.price,
                    volume_1day_usd: data.volume_24h,
                    price_usd_change_percent_24h: calculatePriceChange(data)
                });
                
                // Update the UI if we're on the markets page
                if (window.location.pathname.includes('markets.html')) {
                    updateMarketTable();
                }
            });

            isInitialized = true;
        }
    }

    static async getAssets() {
        // Wait for initial data if we don't have any yet
        if (marketData.size === 0) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait up to 2 seconds for initial data
        }

        // Return cached data from WebSocket
        const assets = Array.from(marketData.values()).map(data => ({
            asset_id: data.product_id,
            name: data.product_id.split('-')[0],
            price_usd: data.price,
            volume_1day_usd: data.volume_24h,
            price_usd_change_percent_24h: data.price_usd_change_percent_24h,
            type_is_crypto: 1
        }));

        if (assets.length === 0) {
            console.warn('No assets data available yet');
            return null;
        }

        return assets;
    }

    static async getAsset(assetId) {
        const data = marketData.get(assetId + '-USD');
        if (!data) return null;
        
        return {
            asset_id: data.product_id,
            name: data.product_id.split('-')[0],
            price_usd: data.price,
            volume_1day_usd: data.volume_24h,
            price_usd_change_percent_24h: data.price_usd_change_percent_24h,
            type_is_crypto: 1
        };
    }

    static async getPriceChange(assetId) {
        const data = marketData.get(assetId + '-USD');
        return data ? data.price_usd_change_percent_24h : 0;
    }

    static async getOHLCV(symbolId, periodId = '1DAY', limit = 7) {
        // Note: OHLCV data is not available through WebSocket
        // You might want to keep using CoinAPI for this or implement a different solution
        console.warn('OHLCV data is not available through WebSocket');
        return [];
    }

    static disconnect() {
        if (coinbaseWebSocket) {
            coinbaseWebSocket.disconnect();
            coinbaseWebSocket = null;
        }
        marketData.clear();
    }
}

// Helper function to calculate price change percentage
function calculatePriceChange(data) {
    if (!data.low_24h || !data.high_24h) return 0;
    const priceChange = ((data.price - data.low_24h) / data.low_24h) * 100;
    return !isNaN(priceChange) ? priceChange : 0;
}

// Update the market table with real data
async function updateMarketTable() {
    const assets = await CryptoAPI.getAssets();
    if (!assets) return;

    const tableBody = document.getElementById('cryptoTableBody');
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    // Filter and sort assets by market cap
    const topAssets = assets
        .filter(asset => asset.type_is_crypto === 1 && asset.volume_1day_usd > 0)
        .sort((a, b) => b.volume_1day_usd - a.volume_1day_usd)
        .slice(0, 10);

    // Add rows to table
    topAssets.forEach((asset, index) => {
        const priceChange = asset.price_usd_change_percent_24h || 0;
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="flex items-center space-x-3">
                        <div>
                            <div class="font-bold">${asset.name}</div>
                            <div class="text-sm opacity-50">${asset.asset_id}</div>
                        </div>
                    </div>
                </td>
                <td>$${asset.price_usd?.toFixed(2) || 'N/A'}</td>
                <td class="${priceChange >= 0 ? 'text-success' : 'text-error'} font-mono">
                    <div class="flex items-center gap-1">
                        <i class="fas fa-${priceChange >= 0 ? 'arrow-up' : 'arrow-down'} text-xs"></i>
                        ${priceChange >= 0 ? '+' : ''}${Math.abs(priceChange).toFixed(2)}%
                    </div>
                </td>
                <td>$${(asset.volume_1day_usd / 1e9).toFixed(2)}B</td>
                <td>
                    <div class="flex items-center space-x-2">
                        <button class="btn btn-xs btn-primary" onclick="trackAsset('${asset.asset_id}')">
                            <i class="fas fa-plus mr-1"></i>Track
                        </button>
                        <button class="btn btn-xs btn-ghost btn-square">
                            <i class="fas fa-star"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Update market overview cards
async function updateMarketOverview() {
    const assets = await CryptoAPI.getAssets();
    if (!assets) return;

    // Calculate total market cap and 24h volume
    const totalMarketCap = assets
        .filter(asset => asset.type_is_crypto === 1)
        .reduce((sum, asset) => sum + (asset.volume_1day_usd || 0), 0);

    const totalVolume = assets
        .filter(asset => asset.type_is_crypto === 1)
        .reduce((sum, asset) => sum + (asset.volume_1day_usd || 0), 0);

    // Calculate average percentage change
    const avgChange = assets
        .filter(asset => asset.type_is_crypto === 1)
        .reduce((sum, asset) => sum + (asset.price_usd_change_percent_24h || 0), 0) / assets.length;

    // Update DOM elements
    document.querySelector('.stat-value.text-primary').textContent = 
        `$${(totalMarketCap / 1e12).toFixed(2)}T`;
    document.querySelector('.stat-desc.text-success').innerHTML = `
        <div class="flex items-center gap-1">
            <i class="fas fa-${avgChange >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
            <span>${avgChange >= 0 ? '+' : ''}${Math.abs(avgChange).toFixed(2)}% (24h)</span>
        </div>
    `;

    document.querySelector('.stat-value.text-secondary').textContent = 
        `$${(totalVolume / 1e9).toFixed(2)}B`;
}

// Initialize real-time updates
function initializeRealTimeUpdates() {
    // Initial update
    updateMarketTable();
    updateMarketOverview();

    // Update every 5 minutes
    setInterval(() => {
        updateMarketTable();
        updateMarketOverview();
    }, 5 * 60 * 1000);
}

// Export functions for use in other files
window.CryptoAPI = CryptoAPI;
window.initializeRealTimeUpdates = initializeRealTimeUpdates;

async function displayMarketData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadingPlaceholder = document.getElementById('loadingPlaceholder');
    
    try {
        // Show loading state
        loadingIndicator?.classList.remove('hidden');
        loadingPlaceholder?.classList.remove('hidden');

        const assets = await CryptoAPI.getAssets();
        if (!assets) throw new Error('Failed to fetch assets');

        const tableBody = document.getElementById('cryptoTableBody');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Filter and sort assets
        const marketAssets = assets
            .filter(asset => asset.type_is_crypto === 1 && asset.volume_1day_usd > 0)
            .sort((a, b) => b.volume_1day_usd - a.volume_1day_usd)
            .slice(0, 20); // Reduce to top 20 for better performance

        // Get price changes for top assets
        const assetsWithChanges = await Promise.all(
            marketAssets.map(async (asset) => ({
                ...asset,
                price_change_24h: await CryptoAPI.getPriceChange(asset.asset_id)
            }))
        );

        // Add rows to table
        assetsWithChanges.forEach((asset, index) => {
            const priceChange = parseFloat(asset.price_change_24h) || 0;
            const marketCap = asset.volume_1day_usd || 0;
            const volume24h = asset.volume_1day_usd || 0;

            const row = `
                <tr>
                    <td class="hidden sm:table-cell">${index + 1}</td>
                    <td>
                        <div class="flex items-center space-x-3">
                            <div class="avatar placeholder">
                                <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                                    <span class="text-xs">${asset.asset_id.substring(0, 2)}</span>
                                </div>
                            </div>
                            <div>
                                <a href="coin-details.html?id=${asset.asset_id}" class="font-bold hover:text-primary">${asset.name}</a>
                                <div class="text-sm opacity-50">${asset.asset_id}</div>
                            </div>
                        </div>
                    </td>
                    <td class="font-mono">
                        <div class="flex flex-col sm:flex-row items-end sm:items-center gap-1">
                            $${asset.price_usd?.toFixed(2) || 'N/A'}
                            <span class="${priceChange >= 0 ? 'text-success' : 'text-error'} text-xs sm:hidden">
                                <i class="fas fa-${priceChange >= 0 ? 'arrow-up' : 'arrow-down'} text-xs"></i>
                                ${priceChange === 0 ? '0.00' : 
                                  (priceChange > 0 ? '+' : '-') + Math.abs(priceChange).toFixed(2)}%
                            </span>
                        </div>
                    </td>
                    <td class="${priceChange >= 0 ? 'text-success' : 'text-error'} font-mono hidden sm:table-cell">
                        <div class="flex items-center gap-1">
                            <i class="fas fa-${priceChange >= 0 ? 'arrow-up' : 'arrow-down'} text-xs"></i>
                            ${priceChange === 0 ? '0.00' : 
                              (priceChange > 0 ? '+' : '-') + Math.abs(priceChange).toFixed(2)}%
                        </div>
                    </td>
                    <td class="font-mono hidden md:table-cell">$${formatNumber(marketCap)}</td>
                    <td class="font-mono hidden lg:table-cell">$${formatNumber(volume24h)}</td>
                    <td>
                        <div class="flex items-center space-x-1 sm:space-x-2 justify-end sm:justify-start">
                            <button class="btn btn-xs btn-primary hidden sm:inline-flex" onclick="trackAsset('${asset.asset_id}')">
                                <i class="fas fa-plus mr-1"></i>Track
                            </button>
                            <button class="btn btn-xs btn-primary sm:hidden" onclick="trackAsset('${asset.asset_id}')">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-xs btn-ghost btn-square" onclick="toggleFavorite('${asset.asset_id}')">
                                <i class="fas fa-star"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

    } catch (error) {
        console.error('Error displaying market data:', error);
        const tableBody = document.getElementById('cryptoTableBody');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-error py-4">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Error loading market data. Please try again later.
                    </td>
                </tr>
            `;
        }
    } finally {
        // Hide loading state
        loadingIndicator?.classList.add('hidden');
        loadingPlaceholder?.classList.add('hidden');
    }
}

// Helper function to format large numbers
function formatNumber(number) {
    if (number >= 1e12) return (number / 1e12).toFixed(2) + 'T';
    if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
    if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
    if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
    return number.toFixed(2);
}

// Search functionality
function filterMarkets() {
    const input = document.getElementById('cryptoSearchInput');
    const filter = input.value.toLowerCase();
    const tbody = document.getElementById('cryptoTableBody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const nameCell = row.getElementsByClassName('font-bold')[0];
        const symbolCell = row.getElementsByClassName('opacity-50')[0];
        if (nameCell && symbolCell) {
            const name = nameCell.textContent || nameCell.innerText;
            const symbol = symbolCell.textContent || symbolCell.innerText;
            const shouldShow = name.toLowerCase().indexOf(filter) > -1 || 
                             symbol.toLowerCase().indexOf(filter) > -1;
            row.style.display = shouldShow ? '' : 'none';
        }
    }
}

// Initialize WebSocket when the page loads
document.addEventListener('DOMContentLoaded', () => {
    CryptoAPI.initialize();
    
    if (window.location.pathname.includes('markets.html')) {
        displayMarketData();
    }
});

// Clean up WebSocket connection when leaving the page
window.addEventListener('beforeunload', () => {
    CryptoAPI.disconnect();
}); 