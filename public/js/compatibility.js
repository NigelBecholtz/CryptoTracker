/**
 * Compatibility Layer for Gemini API
 * This file adds missing methods to ensure the existing pages can continue to work
 * with the new Gemini API implementation.
 */

// Define fallback data for common cryptocurrencies
window.FALLBACK_DATA = {
    'BTC': {
        name: 'Bitcoin',
        asset_id: 'BTC',
        price_usd: 44567.89,
        price_usd_change_percent_24h: 2.34,
        volume_1day_usd: 28765432198,
        supply: 19000000
    },
    'ETH': {
        name: 'Ethereum',
        asset_id: 'ETH',
        price_usd: 3456.78,
        price_usd_change_percent_24h: 1.45,
        volume_1day_usd: 15432987654,
        supply: 120000000
    },
    'USDT': {
        name: 'Tether',
        asset_id: 'USDT',
        price_usd: 1.00,
        price_usd_change_percent_24h: 0.01,
        volume_1day_usd: 56789012345,
        supply: 83000000000
    },
    'BNB': {
        name: 'Binance Coin',
        asset_id: 'BNB',
        price_usd: 567.89,
        price_usd_change_percent_24h: -0.75,
        volume_1day_usd: 2345678901,
        supply: 165000000
    },
    'SOL': {
        name: 'Solana',
        asset_id: 'SOL',
        price_usd: 123.45,
        price_usd_change_percent_24h: 3.67,
        volume_1day_usd: 4567890123,
        supply: 350000000
    },
    'XRP': {
        name: 'XRP',
        asset_id: 'XRP',
        price_usd: 0.5678,
        price_usd_change_percent_24h: -1.23,
        volume_1day_usd: 3456789012,
        supply: 45000000000
    },
    'ADA': {
        name: 'Cardano',
        asset_id: 'ADA',
        price_usd: 0.45,
        price_usd_change_percent_24h: 0.98,
        volume_1day_usd: 1234567890,
        supply: 33000000000
    },
    'DOGE': {
        name: 'Dogecoin',
        asset_id: 'DOGE',
        price_usd: 0.123,
        price_usd_change_percent_24h: 5.43,
        volume_1day_usd: 2345678901,
        supply: 130000000000
    }
};

// Add compatibility methods to CryptoAPI
(function() {
    // Ensure CryptoAPI exists
    if (!window.CryptoAPI) {
        console.error("CryptoAPI not found. Compatibility layer cannot be initialized.");
        return;
    }

    console.log("Initializing Gemini API compatibility layer...");
    console.log("Available CryptoAPI methods:", Object.keys(window.CryptoAPI).filter(key => typeof window.CryptoAPI[key] === 'function'));

    /**
     * Get exchange rates for multiple assets in parallel
     * @param {string[]} assetIds - Array of asset IDs
     * @returns {Promise<object>} - Object with asset IDs as keys and their rates as values
     */
    CryptoAPI.getBatchExchangeRates = async function(assetIds) {
        console.log("getBatchExchangeRates called for assets:", assetIds);
        
        if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
            console.warn("getBatchExchangeRates called with invalid asset IDs");
            return {};
        }

        try {
            // Map asset IDs to promises that get their exchange rates
            const promises = assetIds.map(assetId => 
                CryptoAPI.getExchangeRates(assetId)
                .then(rate => ({ assetId, rate }))
                .catch(error => {
                    console.error(`Error fetching rate for ${assetId}:`, error);
                    return { assetId, rate: null };
                })
            );

            // Execute all promises in parallel
            const results = await Promise.all(promises);
            console.log("Batch exchange rates results:", results);

            // Convert array of results to object with asset IDs as keys
            const rates = {};
            results.forEach(result => {
                if (result && result.assetId) {
                    rates[result.assetId] = result.rate;
                }
            });

            console.log("Mapped batch exchange rates:", rates);
            return rates;
        } catch (error) {
            console.error("Error in getBatchExchangeRates:", error);
            
            // Return fallback data if available
            const fallbackRates = {};
            assetIds.forEach(assetId => {
                const fallback = window.FALLBACK_DATA?.[assetId];
                fallbackRates[assetId] = fallback ? fallback.price_usd : 0;
            });
            
            console.log("Using fallback exchange rates:", fallbackRates);
            return fallbackRates;
        }
    };

    /**
     * Get exchange rate for a single asset
     * @param {string} assetId - Asset ID
     * @returns {Promise<number>} - Exchange rate
     */
    CryptoAPI.getExchangeRates = async function(assetId) {
        console.log(`getExchangeRates called for asset: ${assetId}`);
        
        if (!assetId) {
            console.warn("getExchangeRates called with invalid asset ID");
            return 0;
        }

        try {
            // Convert asset ID to gemini symbol (e.g., BTC -> btcusd)
            const symbol = assetId.toLowerCase() + 'usd';
            console.log(`Getting ticker data for ${symbol}`);

            // Use Gemini ticker API to get current price
            const tickerData = await CryptoAPI.getTickerV2(symbol);
            console.log(`Ticker data for ${symbol}:`, tickerData);

            if (tickerData && tickerData.close) {
                const price = parseFloat(tickerData.close);
                console.log(`Extracted price for ${assetId}: ${price}`);
                return price;
            } else {
                console.warn(`No valid ticker data for ${symbol}, ticker response:`, tickerData);
                throw new Error(`No valid ticker data for ${symbol}`);
            }
        } catch (error) {
            console.error(`Error in getExchangeRates for ${assetId}:`, error);
            
            // Check for fallback data
            const fallback = window.FALLBACK_DATA?.[assetId];
            if (fallback && fallback.price_usd) {
                console.log(`Using fallback price for ${assetId}: ${fallback.price_usd}`);
                return fallback.price_usd;
            }
            
            console.warn(`No fallback data available for ${assetId}, returning 0`);
            return 0;
        }
    };

    /**
     * Get price changes for multiple assets in parallel
     * @param {string[]} assetIds - Array of asset IDs
     * @returns {Promise<object>} - Object with asset IDs as keys and their price changes as values
     */
    CryptoAPI.getBatchPriceChanges = async function(assetIds) {
        console.log("getBatchPriceChanges called for assets:", assetIds);
        
        if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
            console.warn("getBatchPriceChanges called with invalid asset IDs");
            return {};
        }

        try {
            // Map asset IDs to promises that get their price changes
            const promises = assetIds.map(assetId => 
                CryptoAPI.getPriceChange(assetId)
                .then(change => ({ assetId, change }))
                .catch(error => {
                    console.error(`Error fetching price change for ${assetId}:`, error);
                    return { assetId, change: null };
                })
            );

            // Execute all promises in parallel
            const results = await Promise.all(promises);
            console.log("Batch price changes results:", results);

            // Convert array of results to object with asset IDs as keys
            const changes = {};
            results.forEach(result => {
                if (result && result.assetId) {
                    changes[result.assetId] = result.change;
                }
            });

            console.log("Mapped batch price changes:", changes);
            return changes;
        } catch (error) {
            console.error("Error in getBatchPriceChanges:", error);
            
            // Return fallback data if available
            const fallbackChanges = {};
            assetIds.forEach(assetId => {
                const fallback = window.FALLBACK_DATA?.[assetId];
                fallbackChanges[assetId] = fallback ? fallback.price_usd_change_percent_24h : 0;
            });
            
            console.log("Using fallback price changes:", fallbackChanges);
            return fallbackChanges;
        }
    };

    /**
     * Get price change for a single asset
     * @param {string} assetId - Asset ID
     * @returns {Promise<number>} - Price change percentage
     */
    CryptoAPI.getPriceChange = async function(assetId) {
        console.log(`getPriceChange called for asset: ${assetId}`);
        
        if (!assetId) {
            console.warn("getPriceChange called with invalid asset ID");
            return 0;
        }

        try {
            // Convert asset ID to gemini symbol (e.g., BTC -> btcusd)
            const symbol = assetId.toLowerCase() + 'usd';
            console.log(`Getting ticker data for ${symbol} to calculate price change`);

            // Use Gemini ticker API to get 24h price change
            const tickerData = await CryptoAPI.getTickerV2(symbol);
            console.log(`Ticker data for price change ${symbol}:`, tickerData);

            if (tickerData && tickerData.changes && tickerData.changes.length > 0) {
                // Use the 24h percent change value
                const change = parseFloat(tickerData.changes[0]);
                console.log(`Extracted price change for ${assetId}: ${change}%`);
                return change;
            } else {
                console.warn(`No valid change data for ${symbol}, ticker response:`, tickerData);
                throw new Error(`No valid change data for ${symbol}`);
            }
        } catch (error) {
            console.error(`Error in getPriceChange for ${assetId}:`, error);
            
            // Check for fallback data
            const fallback = window.FALLBACK_DATA?.[assetId];
            if (fallback && typeof fallback.price_usd_change_percent_24h !== 'undefined') {
                console.log(`Using fallback price change for ${assetId}: ${fallback.price_usd_change_percent_24h}%`);
                return fallback.price_usd_change_percent_24h;
            }
            
            console.warn(`No fallback change data available for ${assetId}, returning 0`);
            return 0;
        }
    };

    // Add getSymbols method if it doesn't exist
    if (!CryptoAPI.getSymbols) {
        console.log("Adding mock getSymbols method");
        CryptoAPI.getSymbols = async function() {
            console.log("Mock getSymbols called");
            return window.TOP_CRYPTO_SYMBOLS || ['btcusd', 'ethusd', 'ltcusd'];
        };
    }

    /**
     * Helper function to format market numbers for display
     * @param {number} value - The numeric value to format
     * @param {number} decimals - Number of decimal places to show
     * @param {boolean} withCommas - Whether to add thousand separators
     * @returns {string} - Formatted string
     */
    window.formatMarketNumber = function(value, decimals = 2, withCommas = true) {
        if (isNaN(value) || value === null || value === undefined) {
            return '0';
        }
        
        // Handle large numbers with specific formatting
        if (Math.abs(value) >= 1e9) {
            return (value / 1e9).toFixed(decimals) + 'B';
        } else if (Math.abs(value) >= 1e6) {
            return (value / 1e6).toFixed(decimals) + 'M';
        } else if (Math.abs(value) >= 1e3) {
            return (value / 1e3).toFixed(decimals) + 'K';
        }
        
        // Format with decimal places
        const formatted = parseFloat(value).toFixed(decimals);
        
        // Add thousand separators if requested
        if (withCommas) {
            return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        return formatted;
    };

    /**
     * Update the market overview on the markets.blade.php page
     * @param {Array} assets - Array of crypto assets
     */
    window.updateMarketOverview = function(assets) {
        console.log("updateMarketOverview called with assets:", assets);
        
        if (!assets || !Array.isArray(assets) || assets.length === 0) {
            console.warn("updateMarketOverview called with invalid assets");
            return;
        }

        try {
            let totalMarketCap = 0;
            let totalVolume = 0;
            let totalAssets = 0;
            let totalPercentChange = 0;
            
            // Calculate totals from assets data
            assets.forEach(asset => {
                if (asset && asset.price_usd && asset.supply) {
                    // Calculate market cap (price * supply)
                    const marketCap = asset.price_usd * asset.supply;
                    totalMarketCap += marketCap;
                    
                    // Add volume
                    if (asset.volume_1day_usd) {
                        totalVolume += asset.volume_1day_usd;
                    }
                    
                    // Add percent change (for average calculation)
                    if (asset.price_usd_change_percent_24h) {
                        totalPercentChange += asset.price_usd_change_percent_24h;
                        totalAssets++;
                    }
                }
            });
            
            // Calculate average percent change
            const avgPercentChange = totalAssets > 0 ? totalPercentChange / totalAssets : 0;
            
            console.log("Market overview calculations:", {
                totalMarketCap,
                totalVolume,
                avgPercentChange
            });
            
            // Update DOM elements if they exist
            const marketCapElem = document.getElementById('total-market-cap');
            if (marketCapElem) {
                marketCapElem.textContent = '$' + window.formatMarketNumber(totalMarketCap, 2);
            }
            
            const volumeElem = document.getElementById('total-volume');
            if (volumeElem) {
                volumeElem.textContent = '$' + window.formatMarketNumber(totalVolume, 2);
            }
            
            const percentChangeElem = document.getElementById('avg-percent-change');
            if (percentChangeElem) {
                const changeClass = avgPercentChange >= 0 ? 'text-success' : 'text-danger';
                const changeSign = avgPercentChange >= 0 ? '+' : '';
                percentChangeElem.textContent = changeSign + avgPercentChange.toFixed(2) + '%';
                percentChangeElem.className = 'mt-2 ' + changeClass;
            }
        } catch (error) {
            console.error("Error in updateMarketOverview:", error);
        }
    };

    /**
     * Show error message on the coin-details.blade.php page
     * @param {string} message - Error message to display
     * @param {string} type - Type of message (error, warning, info)
     * @param {number} duration - Auto-dismiss duration in milliseconds
     */
    window.showError = function(message, type = 'error', duration = 5000) {
        console.log(`Showing ${type} message: ${message}`);
        
        try {
            // Create error container if it doesn't exist
            let errorContainer = document.getElementById('error-container');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.id = 'error-container';
                errorContainer.className = 'error-container';
                document.body.appendChild(errorContainer);
                
                // Add CSS for error container
                const style = document.createElement('style');
                style.textContent = `
                    .error-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        max-width: 350px;
                        z-index: 9999;
                    }
                    .alert {
                        margin-bottom: 10px;
                        padding: 15px;
                        border-radius: 4px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        animation: fadeIn 0.3s ease-in-out;
                        position: relative;
                    }
                    .alert-error {
                        background-color: #f8d7da;
                        border-color: #f5c6cb;
                        color: #721c24;
                    }
                    .alert-warning {
                        background-color: #fff3cd;
                        border-color: #ffeeba;
                        color: #856404;
                    }
                    .alert-info {
                        background-color: #d1ecf1;
                        border-color: #bee5eb;
                        color: #0c5460;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Create alert element
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <span>${message}</span>
                <button type="button" class="close" style="position: absolute; right: 10px; top: 5px; cursor: pointer; background: none; border: none; font-size: 20px;">×</button>
            `;
            
            // Add to container
            errorContainer.appendChild(alert);
            
            // Add close button handler
            const closeButton = alert.querySelector('.close');
            closeButton.addEventListener('click', function() {
                errorContainer.removeChild(alert);
            });
            
            // Auto dismiss after duration
            if (duration) {
                setTimeout(() => {
                    if (alert.parentNode === errorContainer) {
                        errorContainer.removeChild(alert);
                    }
                }, duration);
            }
        } catch (error) {
            console.error("Error showing error message:", error);
        }
    };

    console.log("Gemini API compatibility layer successfully loaded.");
})(); 