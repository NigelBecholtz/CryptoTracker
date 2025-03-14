/**
 * Markets Page JavaScript
 * Handles the interaction with the API to show cryptocurrency market data
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Markets page initialized');
    
    // Get the markets table body
    const tableBody = document.getElementById('markets-table-body');
    // Get search input
    const searchInput = document.getElementById('market-search');
    
    // Initialize markets data
    let marketsData = [];
    
    // Show loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
    
    try {
        console.log('Fetching assets from API...');
        // Get all assets from API
        const assets = await CryptoAPI.getAssets();
        console.log(`Fetched ${assets.length} assets from API`);
        
        if (!assets || !Array.isArray(assets) || assets.length === 0) {
            throw new Error('No assets data received from API');
        }
        
        // Store the assets data
        marketsData = assets;
        
        // Update market overview with the assets data
        if (window.updateMarketOverview) {
            window.updateMarketOverview(assets);
        }
        
        // Render the assets in the table
        renderMarketsTable(assets);
        
    } catch (error) {
        console.error('Error loading markets data:', error);
        
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-error mt-4';
        errorElement.innerHTML = `
            <span>Error loading markets data: ${error.message}</span>
            <button onClick="window.location.reload()">Retry</button>
        `;
        
        // Insert error message before the table
        const tableContainer = document.querySelector('.overflow-x-auto');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(errorElement, tableContainer);
        }
        
        // Try to load fallback data from window.FALLBACK_DATA
        if (window.FALLBACK_DATA) {
            console.log('Using fallback data for markets');
            const fallbackAssets = Object.values(window.FALLBACK_DATA);
            
            if (fallbackAssets.length > 0) {
                marketsData = fallbackAssets;
                renderMarketsTable(fallbackAssets);
                
                if (window.updateMarketOverview) {
                    window.updateMarketOverview(fallbackAssets);
                }
            }
        }
    } finally {
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Add event listener for search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const filteredData = marketsData.filter(asset => 
                asset.name.toLowerCase().includes(searchTerm) || 
                asset.asset_id.toLowerCase().includes(searchTerm)
            );
            renderMarketsTable(filteredData);
        });
    }
    
    // Add event listeners for sorting
    document.querySelectorAll('[data-sort]').forEach(header => {
        header.addEventListener('click', function() {
            const sortKey = this.getAttribute('data-sort');
            const isCurrentSortKey = this.classList.contains('sorted-asc') || 
                                     this.classList.contains('sorted-desc');
            
            // Remove all sorting indicators
            document.querySelectorAll('[data-sort]').forEach(el => {
                el.classList.remove('sorted-asc', 'sorted-desc');
            });
            
            let sortedData;
            if (isCurrentSortKey && this.classList.contains('sorted-asc')) {
                // If already sorted ascending, sort descending
                sortedData = [...marketsData].sort((a, b) => 
                    getSortValue(b, sortKey) - getSortValue(a, sortKey)
                );
                this.classList.add('sorted-desc');
            } else {
                // Otherwise, sort ascending
                sortedData = [...marketsData].sort((a, b) => 
                    getSortValue(a, sortKey) - getSortValue(b, sortKey)
                );
                this.classList.add('sorted-asc');
            }
            
            renderMarketsTable(sortedData);
        });
    });
    
    // Function to render the markets table
    function renderMarketsTable(assets) {
        if (!tableBody) return;
        
        // Clear the table
        tableBody.innerHTML = '';
        
        if (assets.length === 0) {
            const noResultsRow = document.createElement('tr');
            noResultsRow.innerHTML = `
                <td colspan="7" class="text-center py-4">
                    No cryptocurrencies found matching your search.
                </td>
            `;
            tableBody.appendChild(noResultsRow);
            return;
        }
        
        // Slice to only show top 100 assets by default
        const displayAssets = assets.slice(0, 100);
        
        // Add each asset to the table
        displayAssets.forEach((asset, index) => {
            const row = document.createElement('tr');
            
            // Format the 24h change with proper color and sign
            const changeClass = asset.price_usd_change_percent_24h >= 0 ? 'text-success' : 'text-danger';
            const changeSign = asset.price_usd_change_percent_24h >= 0 ? '+' : '';
            const formattedChange = `${changeSign}${asset.price_usd_change_percent_24h.toFixed(2)}%`;
            
            // Format market cap and volume
            const marketCap = asset.price_usd * (asset.supply || 0);
            const formattedMarketCap = window.formatMarketNumber ? 
                window.formatMarketNumber(marketCap) : 
                `$${(marketCap / 1e9).toFixed(2)}B`;
            
            const formattedVolume = window.formatMarketNumber ? 
                window.formatMarketNumber(asset.volume_1day_usd) : 
                `$${(asset.volume_1day_usd / 1e9).toFixed(2)}B`;
            
            // Format price based on its magnitude
            let formattedPrice;
            if (asset.price_usd >= 1000) {
                formattedPrice = `$${asset.price_usd.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            } else if (asset.price_usd >= 1) {
                formattedPrice = `$${asset.price_usd.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                })}`;
            } else {
                formattedPrice = `$${asset.price_usd.toLocaleString('en-US', {
                    minimumFractionDigits: 6,
                    maximumFractionDigits: 8
                })}`;
            }
            
            // Build the row HTML
            row.innerHTML = `
                <td class="py-3">${index + 1}</td>
                <td class="py-3">
                    <a href="/coin/${asset.asset_id}" class="flex items-center">
                        <span class="coin-symbol">${asset.asset_id}</span>
                        <span class="ml-2 text-sm opacity-70">${asset.name}</span>
                    </a>
                </td>
                <td class="py-3">${formattedPrice}</td>
                <td class="py-3 ${changeClass}">${formattedChange}</td>
                <td class="py-3">${formattedMarketCap}</td>
                <td class="py-3">${formattedVolume}</td>
                <td class="py-3">
                    <button class="btn btn-sm btn-outline btn-primary" onclick="window.location.href='/coin/${asset.asset_id}'">
                        View
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Helper function to get sort value based on key
    function getSortValue(asset, key) {
        switch (key) {
            case 'rank':
                return asset.rank || 999999;
            case 'name':
                return asset.name.toLowerCase();
            case 'price':
                return asset.price_usd || 0;
            case 'change':
                return asset.price_usd_change_percent_24h || 0;
            case 'market_cap':
                return (asset.price_usd || 0) * (asset.supply || 0);
            case 'volume':
                return asset.volume_1day_usd || 0;
            default:
                return 0;
        }
    }
    
    // Auto-refresh every 60 seconds
    setInterval(async () => {
        try {
            console.log('Auto-refreshing market data...');
            const assets = await CryptoAPI.getAssets();
            
            if (assets && Array.isArray(assets) && assets.length > 0) {
                marketsData = assets;
                
                // Update market overview
                if (window.updateMarketOverview) {
                    window.updateMarketOverview(assets);
                }
                
                // Re-apply current search filter if any
                const searchTerm = searchInput?.value.toLowerCase().trim() || '';
                const filteredData = searchTerm ? 
                    marketsData.filter(asset => 
                        asset.name.toLowerCase().includes(searchTerm) || 
                        asset.asset_id.toLowerCase().includes(searchTerm)
                    ) : 
                    marketsData;
                
                // Re-render table with updated data
                renderMarketsTable(filteredData);
            }
        } catch (error) {
            console.error('Error auto-refreshing market data:', error);
            // Don't show error message for background refresh
        }
    }, 60000);
}); 