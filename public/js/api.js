const COIN_API_KEY = '493e46c7-b5e7-42a2-891a-87c781b84cdc';
const BASE_URL = 'https://rest.coinapi.io/v1';

class CryptoAPI {
    static async getAssets() {
        try {
            // Check cache first
            if (this.cache.assets && this.cache.lastUpdate && 
                (Date.now() - this.cache.lastUpdate) < this.cache.cacheTimeout) {
                return this.cache.assets;
            }

            const response = await fetch(`${BASE_URL}/assets`, {
                headers: {
                    'X-CoinAPI-Key': COIN_API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const filteredData = data.filter(asset => asset.type_is_crypto === 1);
            
            // Update cache
            this.cache.assets = filteredData;
            this.cache.lastUpdate = Date.now();
            
            return filteredData;
        } catch (error) {
            console.error('Error fetching assets:', error);
            return null;
        }
    }

    static async getAsset(assetId) {
        try {
            // Check cache first
            if (this.cache.assets) {
                const cachedAsset = this.cache.assets.find(a => a.asset_id === assetId);
                if (cachedAsset) return cachedAsset;
            }

            const response = await fetch(`${BASE_URL}/assets/${assetId}`, {
                headers: {
                    'X-CoinAPI-Key': COIN_API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching asset:', error);
            return null;
        }
    }

    static async getOHLCV(symbolId, periodId = '1DAY', limit = 30) {
        try {
            // Convert asset ID to symbol ID format (e.g., "BTC" -> "BITSTAMP_SPOT_BTC_USD")
            const symbolIdFormatted = `BITSTAMP_SPOT_${symbolId}_USD`;
            
            const response = await fetch(
                `${BASE_URL}/ohlcv/${symbolIdFormatted}/history?period_id=${periodId}&limit=${limit}`,
                {
                    headers: {
                        'X-CoinAPI-Key': COIN_API_KEY
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching OHLCV data:', error);
            return null;
        }
    }

    static async getPriceChange(assetId) {
        try {
            // Check cache first
            const cacheKey = `${assetId}_price_change`;
            if (this.cache.priceChanges[cacheKey] && 
                Date.now() - this.cache.priceChanges[cacheKey].timestamp < 60000) { // 1 minute cache
                return this.cache.priceChanges[cacheKey].data;
            }

            // Get current time and 24 hours ago in UTC
            const now = new Date();
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            
            // Format dates in ISO format with milliseconds
            const timeStart = yesterday.toISOString().split('.')[0] + 'Z';
            const timeEnd = now.toISOString().split('.')[0] + 'Z';
            
            // Convert asset ID to symbol ID format (e.g., "BTC" -> "BITSTAMP_SPOT_BTC_USD")
            const symbolIdFormatted = `BITSTAMP_SPOT_${assetId}_USD`;
            
            const response = await fetch(
                `${BASE_URL}/exchangerate/${symbolIdFormatted}/history?period_id=1HRS&time_start=${timeStart}&time_end=${timeEnd}&limit=24`,
                {
                    headers: {
                        'X-CoinAPI-Key': COIN_API_KEY
                    }
                }
            );
            
            if (!response.ok) {
                if (response.status === 550) {
                    // If we get a 550 error, try getting the current rate instead
                    const currentRate = await this.getExchangeRates(assetId);
                    if (currentRate) {
                        return 0; // Return 0% change if we can't get historical data
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            let priceChange = 0;
            
            if (data && Array.isArray(data) && data.length >= 2 && 
                typeof data[0].rate === 'number' && typeof data[data.length - 1].rate === 'number') {
                const oldPrice = data[0].rate;
                const newPrice = data[data.length - 1].rate;
                if (oldPrice !== 0) {
                    priceChange = ((newPrice - oldPrice) / oldPrice) * 100;
                }
            }

            // Update cache
            this.cache.priceChanges[cacheKey] = {
                data: priceChange,
                timestamp: Date.now()
            };
            
            return priceChange;
        } catch (error) {
            console.error(`Error fetching price change for ${assetId}:`, error);
            return 0;
        }
    }

    static async getExchangeRates(assetId) {
        try {
            // Check cache first
            const cacheKey = `${assetId}_rate`;
            if (this.cache.exchangeRates[cacheKey] && 
                Date.now() - this.cache.exchangeRates[cacheKey].timestamp < 60000) { // 1 minute cache
                return this.cache.exchangeRates[cacheKey].data;
            }

            // Convert asset ID to symbol ID format (e.g., "BTC" -> "BITSTAMP_SPOT_BTC_USD")
            const symbolIdFormatted = `BITSTAMP_SPOT_${assetId}_USD`;
            
            const response = await fetch(`${BASE_URL}/exchangerate/${symbolIdFormatted}`, {
                headers: {
                    'X-CoinAPI-Key': COIN_API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update cache
            this.cache.exchangeRates[cacheKey] = {
                data,
                timestamp: Date.now()
            };
            
            return data;
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            return null;
        }
    }

    static async getSymbols() {
        try {
            const response = await fetch(`${BASE_URL}/symbols`, {
                headers: {
                    'X-CoinAPI-Key': COIN_API_KEY
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching symbols:', error);
            return null;
        }
    }

    // Cache for API responses
    static cache = {
        assets: null,
        lastUpdate: null,
        cacheTimeout: 5 * 60 * 1000, // 5 minutes
        exchangeRates: {},
        priceChanges: {}
    };

    // Batch fetch multiple exchange rates at once
    static async getBatchExchangeRates(assetIds) {
        try {
            const promises = assetIds.map(assetId => this.getExchangeRates(assetId));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error fetching batch exchange rates:', error);
            return null;
        }
    }

    // Batch fetch multiple price changes at once
    static async getBatchPriceChanges(assetIds) {
        try {
            const promises = assetIds.map(assetId => this.getPriceChange(assetId));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error fetching batch price changes:', error);
            return null;
        }
    }
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
        .reduce((sum, asset) => sum + (asset.volume_1day_usd || 0), 0);

    const totalVolume = assets
        .reduce((sum, asset) => sum + (asset.volume_1day_usd || 0), 0);

    // Calculate average percentage change
    const avgChange = assets
        .reduce((sum, asset) => sum + (asset.price_usd_change_percent_24h || 0), 0) / assets.length;

    // Update DOM elements with null checks
    const marketCapElement = document.querySelector('.stat-value.text-primary');
    const marketCapDescElement = document.querySelector('.stat-desc.text-success');
    const volumeElement = document.querySelector('.stat-value.text-secondary');

    if (marketCapElement) {
        marketCapElement.textContent = `$${(totalMarketCap / 1e12).toFixed(2)}T`;
    }

    if (marketCapDescElement) {
        marketCapDescElement.innerHTML = `
            <div class="flex items-center gap-1">
                <i class="fas fa-${avgChange >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                <span>${avgChange >= 0 ? '+' : ''}${Math.abs(avgChange).toFixed(2)}% (24h)</span>
            </div>
        `;
    }

    if (volumeElement) {
        volumeElement.textContent = `$${(totalVolume / 1e9).toFixed(2)}B`;
    }
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

// User preferences storage
const UserPreferences = {
    save(key, value) {
        localStorage.setItem(`crypto_${key}`, JSON.stringify(value));
    },
    
    load(key) {
        return JSON.parse(localStorage.getItem(`crypto_${key}`));
    },
    
    saveTableSettings(settings) {
        this.save('table_settings', {
            sortColumn: settings.sortColumn,
            sortDirection: settings.sortDirection,
            currentPage: settings.currentPage,
            itemsPerPage: settings.itemsPerPage
        });
    },
    
    getTableSettings() {
        return this.load('table_settings') || {
            sortColumn: 0,
            sortDirection: 'asc',
            currentPage: 1,
            itemsPerPage: 20
        };
    }
};

// Table state management
let tableState = {
    ...UserPreferences.getTableSettings(),
    data: [],
    filteredData: []
};

// Sorting function
function sortTable(column) {
    const table = document.querySelector('table');
    const isAscending = tableState.sortDirection === 'asc';
    
    // Update sort direction if clicking same column
    if (tableState.sortColumn === column) {
        tableState.sortDirection = isAscending ? 'desc' : 'asc';
    } else {
        tableState.sortColumn = column;
        tableState.sortDirection = 'asc';
    }
    
    // Sort the data
    tableState.filteredData.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];
        
        // Handle different data types
        if (typeof aValue === 'string') {
            return isAscending ? 
                aValue.localeCompare(bValue) : 
                bValue.localeCompare(aValue);
        } else {
            return isAscending ? 
                aValue - bValue : 
                bValue - aValue;
        }
    });
    
    // Update UI
    updateTableUI();
    
    // Save preferences
    UserPreferences.saveTableSettings(tableState);
}

// Pagination setup
function setupPagination() {
    const totalPages = Math.ceil(tableState.filteredData.length / tableState.itemsPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex flex-col sm:flex-row items-center justify-between gap-4 mt-6';
    
    // Items per page selector
    paginationContainer.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="text-sm opacity-70">Items per page:</span>
            <select class="select select-bordered select-sm w-20" 
                    onchange="changeItemsPerPage(this.value)">
                <option value="10" ${tableState.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                <option value="20" ${tableState.itemsPerPage === 20 ? 'selected' : ''}>20</option>
                <option value="50" ${tableState.itemsPerPage === 50 ? 'selected' : ''}>50</option>
            </select>
        </div>
    `;
    
    // Pagination buttons
    const paginationButtons = document.createElement('div');
    paginationButtons.className = 'join';
    
    // Previous button
    paginationButtons.innerHTML += `
        <button class="join-item btn btn-sm ${tableState.currentPage === 1 ? 'btn-disabled' : ''}"
                onclick="changePage(${tableState.currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers with ellipsis
    const maxVisiblePages = 5;
    let startPage = Math.max(1, tableState.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationButtons.innerHTML += `
            <button class="join-item btn btn-sm" onclick="changePage(1)">1</button>
            ${startPage > 2 ? '<button class="join-item btn btn-sm btn-disabled">...</button>' : ''}
        `;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationButtons.innerHTML += `
            <button class="join-item btn btn-sm ${i === tableState.currentPage ? 'btn-active' : ''}"
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    if (endPage < totalPages) {
        paginationButtons.innerHTML += `
            ${endPage < totalPages - 1 ? '<button class="join-item btn btn-sm btn-disabled">...</button>' : ''}
            <button class="join-item btn btn-sm" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
    }
    
    // Next button
    paginationButtons.innerHTML += `
        <button class="join-item btn btn-sm ${tableState.currentPage === totalPages ? 'btn-disabled' : ''}"
                onclick="changePage(${tableState.currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.appendChild(paginationButtons);
    
    // Remove existing pagination if any
    const existingPagination = document.querySelector('.flex.flex-col.sm\\:flex-row');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Add new pagination
    document.querySelector('.card-body').appendChild(paginationContainer);
}

// Change page function
function changePage(page) {
    if (page < 1 || page > Math.ceil(tableState.filteredData.length / tableState.itemsPerPage)) {
        return;
    }
    
    tableState.currentPage = page;
    updateTableUI();
    UserPreferences.saveTableSettings(tableState);
}

// Change items per page
function changeItemsPerPage(itemsPerPage) {
    tableState.itemsPerPage = parseInt(itemsPerPage);
    tableState.currentPage = 1; // Reset to first page
    updateTableUI();
    UserPreferences.saveTableSettings(tableState);
}

// Update table UI
function updateTableUI() {
    const tableBody = document.getElementById('cryptoTableBody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Calculate start and end indices for current page
    const startIndex = (tableState.currentPage - 1) * tableState.itemsPerPage;
    const endIndex = startIndex + tableState.itemsPerPage;
    
    // Get current page data
    const pageData = tableState.filteredData.slice(startIndex, endIndex);
    
    // Add rows to table
    pageData.forEach((asset, index) => {
        const priceChange = asset.price_usd_change_percent_24h || 0;
        const marketCap = asset.volume_1day_usd || 0;
        const volume24h = asset.volume_1day_usd || 0;
        
        const row = `
            <tr>
                <td class="hidden sm:table-cell">${startIndex + index + 1}</td>
                <td>
                    <div class="flex items-center space-x-3">
                        <div class="avatar placeholder">
                            <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                                <span class="text-xs">${asset.asset_id.substring(0, 2)}</span>
                            </div>
                        </div>
                        <div>
                            <a href="/coin/${asset.asset_id}" class="font-bold hover:text-primary">${asset.name}</a>
                            <div class="text-sm opacity-50">${asset.asset_id}</div>
                        </div>
                    </div>
                </td>
                <td class="font-mono">
                    <div class="flex flex-col sm:flex-row items-end sm:items-center gap-1">
                        <button class="btn btn-ghost btn-xs h-auto p-0 hover:bg-transparent" onclick="sortTable('price_usd')">
                            $${asset.price_usd?.toFixed(2) || 'N/A'}
                            ${tableState.sortColumn === 'price_usd' ? 
                                `<i class="fas fa-${tableState.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} ml-1"></i>` : 
                                ''}
                        </button>
                        <span class="${priceChange >= 0 ? 'text-success' : 'text-error'} text-xs sm:hidden">
                            <i class="fas fa-${priceChange >= 0 ? 'arrow-up' : 'arrow-down'} text-xs"></i>
                            ${priceChange === 0 ? '0.00' : 
                              (priceChange > 0 ? '+' : '-') + Math.abs(priceChange).toFixed(2)}%
                        </span>
                    </div>
                </td>
                <td class="${priceChange >= 0 ? 'text-success' : 'text-error'} font-mono hidden sm:table-cell">
                    <button class="btn btn-ghost btn-xs h-auto p-0 hover:bg-transparent" onclick="sortTable('price_usd_change_percent_24h')">
                        <div class="flex items-center gap-1">
                            <i class="fas fa-${priceChange >= 0 ? 'arrow-up' : 'arrow-down'} text-xs"></i>
                            ${priceChange === 0 ? '0.00' : 
                              (priceChange > 0 ? '+' : '-') + Math.abs(priceChange).toFixed(2)}%
                            ${tableState.sortColumn === 'price_usd_change_percent_24h' ? 
                                `<i class="fas fa-${tableState.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} ml-1"></i>` : 
                                ''}
                        </div>
                    </button>
                </td>
                <td class="font-mono hidden md:table-cell">
                    <button class="btn btn-ghost btn-xs h-auto p-0 hover:bg-transparent" onclick="sortTable('volume_1day_usd')">
                        $${formatNumber(marketCap)}
                        ${tableState.sortColumn === 'volume_1day_usd' ? 
                            `<i class="fas fa-${tableState.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} ml-1"></i>` : 
                            ''}
                    </button>
                </td>
                <td class="font-mono hidden lg:table-cell">
                    <button class="btn btn-ghost btn-xs h-auto p-0 hover:bg-transparent" onclick="sortTable('volume_1day_usd')">
                        $${formatNumber(volume24h)}
                        ${tableState.sortColumn === 'volume_1day_usd' ? 
                            `<i class="fas fa-${tableState.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} ml-1"></i>` : 
                            ''}
                    </button>
                </td>
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
    
    // Update pagination
    setupPagination();
}

// Update the displayMarketData function
async function displayMarketData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const loadingPlaceholder = document.getElementById('loadingPlaceholder');
    
    try {
        // Show loading state
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');
        if (loadingPlaceholder) loadingPlaceholder.classList.remove('hidden');

        // Get assets data
        const assets = await CryptoAPI.getAssets();
        if (!assets) throw new Error('Failed to fetch assets');

        // Filter and sort assets
        tableState.data = assets
            .sort((a, b) => b.volume_1day_usd - a.volume_1day_usd);

        // Apply current filters and sorting
        tableState.filteredData = [...tableState.data];
        sortTable(tableState.sortColumn);

        // Update UI
        updateTableUI();

        // Update market overview cards
        updateMarketOverview();

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
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
        if (loadingPlaceholder) loadingPlaceholder.classList.add('hidden');
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

// Initialize market data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('markets')) {
        displayMarketData();
        // Refresh data every 1 minute
        setInterval(displayMarketData, 60000);
    }
}); 