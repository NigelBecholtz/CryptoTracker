/**
 * CryptoTracker - Gemini API Integration
 * This file handles all interactions with the Gemini cryptocurrency exchange API
 */

// Base URL for Gemini API
const BASE_URL = 'https://api.gemini.com/v1';
const BASE_URL_V2 = 'https://api.gemini.com/v2';

// Add a proxy URL if needed to bypass CORS restrictions
const USE_PROXY = true;
// List of CORS proxy services to try in order
const PROXY_URLS = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/'
];
// Start with the first proxy
let currentProxyIndex = 0;
let PROXY_URL = PROXY_URLS[currentProxyIndex];

// Function to try the next available proxy
function switchToNextProxy() {
    currentProxyIndex = (currentProxyIndex + 1) % PROXY_URLS.length;
    PROXY_URL = PROXY_URLS[currentProxyIndex];
    console.log(`Switching to proxy: ${PROXY_URL}`);
    return PROXY_URL;
}

// Mapping of Gemini symbols to standard asset IDs
const SYMBOL_TO_ASSET_ID = {
    'btcusd': 'BTC',
    'ethusd': 'ETH',
    'ltcusd': 'LTC',
    'bchusd': 'BCH',
    'zecusd': 'ZEC',
    'linkusd': 'LINK',
    'uniusd': 'UNI',
    'maticusd': 'MATIC',
    'solusd': 'SOL',
    'dogeusd': 'DOGE',
    'shibusd': 'SHIB',
    'adausd': 'ADA',
    'avaxusd': 'AVAX',
    'dotusd': 'DOT',
    'trxusd': 'TRX',
    'xrpusd': 'XRP'
};

// Human-readable names for symbols
const SYMBOL_NAMES = {
    'btcusd': 'Bitcoin',
    'ethusd': 'Ethereum',
    'ltcusd': 'Litecoin',
    'bchusd': 'Bitcoin Cash',
    'zecusd': 'Zcash',
    'linkusd': 'Chainlink',
    'uniusd': 'Uniswap',
    'maticusd': 'Polygon',
    'solusd': 'Solana',
    'dogeusd': 'Dogecoin',
    'shibusd': 'Shiba Inu',
    'adausd': 'Cardano',
    'avaxusd': 'Avalanche',
    'dotusd': 'Polkadot',
    'trxusd': 'TRON',
    'xrpusd': 'XRP'
};

// Fallback data for when API fails
const FALLBACK_DATA = {
    'BTC': {
        asset_id: 'BTC',
        name: 'Bitcoin',
        price_usd: 61000,
        price_usd_change_percent_24h: 2.5,
        volume_1day_usd: 50000000000,
        volume_1day_usd_change_percent: 1.2,
        market_cap: 1150000000000,
        supply: 19000000
    },
    'ETH': {
        asset_id: 'ETH',
        name: 'Ethereum',
        price_usd: 3400,
        price_usd_change_percent_24h: 3.2,
        volume_1day_usd: 25000000000,
        volume_1day_usd_change_percent: 1.7,
        market_cap: 410000000000,
        supply: 120000000
    },
    'LTC': {
        asset_id: 'LTC',
        name: 'Litecoin',
        price_usd: 83,
        price_usd_change_percent_24h: 1.8,
        volume_1day_usd: 3500000000,
        volume_1day_usd_change_percent: 0.9,
        market_cap: 6100000000,
        supply: 73000000
    },
    'BCH': {
        asset_id: 'BCH',
        name: 'Bitcoin Cash',
        price_usd: 370,
        price_usd_change_percent_24h: 1.2,
        volume_1day_usd: 2500000000,
        volume_1day_usd_change_percent: 0.5,
        market_cap: 7200000000,
        supply: 19500000
    },
    'LINK': {
        asset_id: 'LINK',
        name: 'Chainlink',
        price_usd: 14.5,
        price_usd_change_percent_24h: 4.1,
        volume_1day_usd: 1800000000,
        volume_1day_usd_change_percent: 2.2,
        market_cap: 8400000000,
        supply: 580000000
    },
    'SOL': {
        asset_id: 'SOL',
        name: 'Solana',
        price_usd: 148,
        price_usd_change_percent_24h: 5.6,
        volume_1day_usd: 4200000000,
        volume_1day_usd_change_percent: 3.1,
        market_cap: 63000000000,
        supply: 425000000
    },
    'DOGE': {
        asset_id: 'DOGE',
        name: 'Dogecoin',
        price_usd: 0.12,
        price_usd_change_percent_24h: 2.9,
        volume_1day_usd: 1200000000,
        volume_1day_usd_change_percent: 1.4,
        market_cap: 16000000000,
        supply: 133000000000
    },
    'ADA': {
        asset_id: 'ADA',
        name: 'Cardano',
        price_usd: 0.48,
        price_usd_change_percent_24h: 1.9,
        volume_1day_usd: 950000000,
        volume_1day_usd_change_percent: 0.8,
        market_cap: 17000000000,
        supply: 35300000000
    },
    'XRP': {
        asset_id: 'XRP',
        name: 'XRP',
        price_usd: 0.53,
        price_usd_change_percent_24h: 2.1,
        volume_1day_usd: 1500000000,
        volume_1day_usd_change_percent: 1.1,
        market_cap: 28000000000,
        supply: 53000000000
    },
    'DOT': {
        asset_id: 'DOT',
        name: 'Polkadot',
        price_usd: 6.8,
        price_usd_change_percent_24h: 3.5,
        volume_1day_usd: 580000000,
        volume_1day_usd_change_percent: 1.8,
        market_cap: 8500000000,
        supply: 1250000000
    }
};

// List of common crypto symbols for reference
const TOP_CRYPTO_SYMBOLS = [
    'btcusd', 'ethusd', 'ltcusd', 'bchusd', 'zecusd', 'linkusd', 
    'uniusd', 'maticusd', 'solusd', 'dogeusd', 'shibusd', 'adausd', 
    'avaxusd', 'dotusd', 'trxusd', 'xrpusd'
];

// Helper function to get appropriate URL with proxy if needed
function getApiUrl(endpoint, useV2 = false) {
    const baseUrl = useV2 ? BASE_URL_V2 : BASE_URL;
    // Remove any leading slashes from endpoint to prevent double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const fullUrl = `${baseUrl}/${cleanEndpoint}`;
    
    // Use proxy if enabled
    if (USE_PROXY) {
        return `${PROXY_URL}${encodeURIComponent(fullUrl)}`;
    }
    
    return fullUrl;
}

// Helper function to retry a fetch request with different proxies if it fails
async function fetchWithProxyFallback(url, options = {}, retries = PROXY_URLS.length) {
    try {
        console.log(`Fetch attempt: ${url}`);
        const response = await fetch(url, options);
        if (!response.ok) {
            console.error(`HTTP error ${response.status}: ${response.statusText}`);
            throw new Error(`HTTP error: ${response.status}`);
        }
        console.log(`Fetch successful: ${url}`);
        return response;
    } catch (error) {
        console.error(`Fetch failed: ${error.message}`, error);
        console.log(`Retries left: ${retries - 1}`);
        
        if (retries > 1 && USE_PROXY) {
            // Switch to the next proxy
            const oldProxy = PROXY_URL;
            switchToNextProxy();
            console.log(`Proxy switch: ${oldProxy} → ${PROXY_URL}`);
            
            // Try to extract the original URL
            let originalUrl = url;
            for (const proxy of PROXY_URLS) {
                if (url.startsWith(proxy)) {
                    try {
                        originalUrl = decodeURIComponent(url.substring(proxy.length));
                        break;
                    } catch (e) {
                        console.warn(`Error decoding URL: ${e.message}`);
                    }
                }
            }
            
            // Construct new URL with the new proxy
            const newUrl = `${PROXY_URL}${encodeURIComponent(originalUrl)}`;
            console.log(`Retrying with new URL: ${newUrl}`);
            
            // Retry the fetch
            return fetchWithProxyFallback(newUrl, options, retries - 1);
        }
        
        console.error(`All proxy attempts failed for: ${url}`);
        throw error;
    }
}

// Cache for API responses
const apiCache = {
    symbols: { data: null, timestamp: 0 },
    tickers: { data: {}, timestamp: {} },
    candles: { data: {}, timestamp: {} },
    symbolDetails: { data: {}, timestamp: {} },
    priceFeeds: { data: null, timestamp: 0 },
    assets: { data: null, timestamp: 0 }
};

// Cache timeout in milliseconds
const CACHE_TIMEOUT = 60000; // 1 minute

/**
 * Main API Class for Gemini
 */
class CryptoAPI {
    /**
     * Get list of all available crypto assets
     * Maps Gemini symbols to a format compatible with the existing application
     */
    static async getAssets() {
        try {
            console.log("getAssets called");
            // Check cache first
            if (apiCache.assets && apiCache.assets.data && 
                (Date.now() - apiCache.assets.timestamp < CACHE_TIMEOUT)) {
                console.log("Returning cached assets data");
                return apiCache.assets.data;
            }

            // Get available symbols from Gemini
            console.log("Fetching symbols from Gemini API");
            const symbols = await this.getSymbols();
            console.log("Symbols fetched:", symbols);
            
            if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
                throw new Error("Failed to fetch symbols from Gemini API");
            }
            
            // Get price feed for all symbols
            console.log("Fetching price feed from Gemini API");
            const priceFeed = await this.getPriceFeed();
            console.log("Price feed fetched:", priceFeed);
            
            // Map to the format expected by the application
            console.log("Mapping symbols to assets format");
            const assets = symbols
                .filter(symbol => symbol.endsWith('usd')) // Only include USD pairs
                .map(symbol => {
                    const assetId = SYMBOL_TO_ASSET_ID[symbol] || symbol.replace('usd', '').toUpperCase();
                    const priceInfo = priceFeed && Array.isArray(priceFeed) 
                        ? priceFeed.find(item => item.pair === symbol.toUpperCase())
                        : null;
                    
                    // If we have fallback data for this asset, use some of its values
                    const fallback = FALLBACK_DATA[assetId];
                    
                    return {
                        asset_id: assetId,
                        name: SYMBOL_NAMES[symbol] || symbol.replace('usd', '').toUpperCase(),
                        price_usd: priceInfo ? parseFloat(priceInfo.price) : (fallback ? fallback.price_usd : 0),
                        price_usd_change_percent_24h: priceInfo ? parseFloat(priceInfo.percentChange24h) : (fallback ? fallback.price_usd_change_percent_24h : 0),
                        volume_1day_usd: fallback ? fallback.volume_1day_usd : 1000000, // Use fallback volume or a reasonable default
                        volume_1day_usd_change_percent: fallback ? fallback.volume_1day_usd_change_percent : 0,
                        type_is_crypto: 1,
                        data_symbols_count: 1,
                        volume_1hrs_usd: 0,
                        volume_1mth_usd: 0,
                        price_usd_change_24h: 0,
                        supply: fallback ? fallback.supply : 1000000 // Use fallback supply or a reasonable default
                    };
                });
            
            console.log("Mapped assets:", assets);
            
            // Update cache
            apiCache.assets.data = assets;
            apiCache.assets.timestamp = Date.now();
            
            return assets;
        } catch (error) {
            console.error('Error fetching assets:', error);
            
            // If API fails, use fallback data
            if (!apiCache.assets || !apiCache.assets.data) {
                console.log('Using fallback assets data');
                const fallbackAssets = Object.values(FALLBACK_DATA);
                
                // Update cache
                if (!apiCache.assets) {
                    apiCache.assets = { data: null, timestamp: 0 };
                }
                apiCache.assets.data = fallbackAssets;
                apiCache.assets.timestamp = Date.now();
                
                return fallbackAssets;
            }
            
            // Use cached data if available
            return apiCache.assets.data;
        }
    }

    /**
     * Get details for a specific asset
     */
    static async getAsset(assetId) {
        try {
            // Check cache first
            if (apiCache.assets) {
                const cachedAsset = apiCache.assets.data.find(a => a.asset_id === assetId);
                if (cachedAsset) return cachedAsset;
            }

            // Check fallback data
            if (FALLBACK_DATA[assetId]) {
                console.log(`Using fallback data for ${assetId}`);
                return FALLBACK_DATA[assetId];
            }

            // Convert assetId to Gemini symbol
            const symbol = assetId.toLowerCase() + 'usd';
            
            // Get ticker data from Gemini
            const ticker = await this.getTickerV2(symbol);
            
            if (!ticker) {
                throw new Error(`Failed to get ticker for ${symbol}`);
            }
            
            // Create asset object from ticker data
            const asset = {
                asset_id: assetId,
                name: SYMBOL_NAMES[symbol] || assetId,
                price_usd: parseFloat(ticker.close),
                price_usd_change_percent_24h: this.calculatePercentChange(ticker.open, ticker.close),
                volume_1day_usd: 0, // Not provided directly by Gemini
                volume_1day_usd_change_percent: 0,
                type_is_crypto: 1,
                data_symbols_count: 1,
                volume_1hrs_usd: 0,
                volume_1mth_usd: 0,
                price_usd_change_24h: parseFloat(ticker.close) - parseFloat(ticker.open),
                supply: 0 // Would need additional data
            };
            
            return asset;
        } catch (error) {
            console.error(`Error fetching asset ${assetId}:`, error);
            
            // Try fallback data again
            if (FALLBACK_DATA[assetId]) {
                console.log(`Using fallback data for ${assetId} after error`);
                return FALLBACK_DATA[assetId];
            }
            
            // Create a basic asset object
            return {
                name: assetId,
                asset_id: assetId,
                price_usd: 0,
                price_usd_change_percent_24h: 0,
                volume_1day_usd: 0,
                volume_1day_usd_change_percent: 0,
                supply: 0,
                rank: 'N/A'
            };
        }
    }

    /**
     * Get OHLCV (Open, High, Low, Close, Volume) data for a symbol
     */
    static async getOHLCV(assetId, periodId = '1DAY', limit = 30) {
        try {
            // Create a cache key based on parameters
            const cacheKey = `${assetId}_${periodId}_${limit}`;
            
            // Check cache
            if (apiCache.candles.data[cacheKey] && 
                (Date.now() - apiCache.candles.timestamp[cacheKey] < 300000)) { // 5 minutes cache
                return apiCache.candles.data[cacheKey];
            }

            // Convert asset ID to Gemini symbol
            const symbol = assetId.toLowerCase() + 'usd';
            
            // Map periodId to Gemini time frame
            let timeFrame;
            switch (periodId) {
                case '1HRS': timeFrame = '1hr'; break;
                case '12HRS': timeFrame = '6hr'; break; // Closest available
                case '1DAY': default: timeFrame = '1day'; break;
            }
            
            // Get candles from Gemini
            const candles = await this.getCandles(symbol, timeFrame);
            
            if (!candles || candles.length === 0) {
                throw new Error(`No candle data available for ${symbol}`);
            }
            
            // Map to expected format
            const ohlcvData = candles.slice(0, limit).map(candle => {
                const [timestamp, open, high, low, close, volume] = candle;
                const date = new Date(timestamp);
                
                return {
                    time_period_start: date.toISOString(),
                    time_open: date.toISOString(),
                    time_close: date.toISOString(),
                    rate_open: open,
                    rate_high: high,
                    rate_low: low,
                    rate_close: close,
                    volume_traded: volume,
                };
            });
            
            // Update cache
            if (!apiCache.candles) apiCache.candles = {};
            apiCache.candles.data[cacheKey] = ohlcvData;
            apiCache.candles.timestamp[cacheKey] = Date.now();
            
            return ohlcvData;
        } catch (error) {
            console.error(`Error fetching OHLCV for ${assetId}:`, error);
            
            // Generate fallback data
            if (FALLBACK_DATA[assetId]) {
                console.log(`Using fallback OHLCV data for ${assetId}`);
                
                const currentPrice = FALLBACK_DATA[assetId].price_usd;
                const changePercent = FALLBACK_DATA[assetId].price_usd_change_percent_24h;
                const changeRatio = 1 + (changePercent / 100);
                
                // Generate historical prices
                const fallbackData = [];
                const now = new Date();
                
                for (let i = 0; i < limit; i++) {
                    // Calculate date
                    const date = new Date(now);
                    
                    if (periodId === '1HRS') {
                        date.setHours(date.getHours() - (limit - i - 1));
                    } else if (periodId === '12HRS') {
                        date.setHours(date.getHours() - (limit - i - 1) * 12);
                    } else { // default to 1DAY
                        date.setDate(date.getDate() - (limit - i - 1));
                    }
                    
                    // Calculate price
                    const factor = Math.pow(changeRatio, (i / (limit - 1)));
                    const price = currentPrice / factor;
                    
                    // Add random noise
                    const noise = 1 + (Math.random() * 0.02 - 0.01);
                    
                    fallbackData.push({
                        time_period_start: date.toISOString(),
                        time_open: date.toISOString(),
                        time_close: date.toISOString(),
                        rate_open: price * noise,
                        rate_high: price * noise * 1.005,
                        rate_low: price * noise * 0.995,
                        rate_close: price * noise,
                        volume_traded: FALLBACK_DATA[assetId].volume_1day_usd / limit,
                    });
                }
                
                // Update cache
                if (!apiCache.candles) apiCache.candles = {};
                apiCache.candles.data[cacheKey] = fallbackData;
                apiCache.candles.timestamp[cacheKey] = Date.now();
                
                return fallbackData;
            }
            
            return [];
        }
    }

    /**
     * Get all available trading symbols from Gemini
     */
    static async getSymbols() {
        try {
            // Check cache first
            if (apiCache.symbols.data && (Date.now() - apiCache.symbols.timestamp < CACHE_TIMEOUT)) {
                console.log("Using cached symbols data");
                return apiCache.symbols.data;
            }
            
            console.log(`Attempting to fetch symbols from: ${getApiUrl('symbols')}`);
            const response = await fetchWithProxyFallback(getApiUrl('symbols'));
            
            const data = await response.json();
            console.log("Symbols successfully fetched from API:", data);
            
            // Update cache
            apiCache.symbols.data = data;
            apiCache.symbols.timestamp = Date.now();
            
            return data;
        } catch (error) {
            console.error('Error fetching symbols:', error);
            
            // Use fallback data
            console.log('Using fallback symbols data');
            
            // Return TOP_CRYPTO_SYMBOLS constant if it exists, or a fallback list
            const fallbackSymbols = TOP_CRYPTO_SYMBOLS || [
                'btcusd', 'ethusd', 'ltcusd', 'bchusd', 'zecusd', 'linkusd', 
                'uniusd', 'maticusd', 'solusd', 'dogeusd', 'shibusd', 'adausd', 
                'avaxusd', 'dotusd', 'trxusd', 'xrpusd'
            ];
            
            // Update cache with fallback data
            apiCache.symbols.data = fallbackSymbols;
            apiCache.symbols.timestamp = Date.now();
            
            return fallbackSymbols;
        }
    }

    /**
     * Get detailed information about a specific symbol
     */
    static async getSymbolDetails(symbol) {
        try {
            // Check cache
            if (apiCache.symbolDetails.data[symbol] && 
                (Date.now() - apiCache.symbolDetails.timestamp[symbol] < CACHE_TIMEOUT)) {
                return apiCache.symbolDetails.data[symbol];
            }
            
            const response = await fetchWithProxyFallback(getApiUrl(`symbols/details/${symbol}`));
            
            const data = await response.json();
            
            // Update cache
            apiCache.symbolDetails.data[symbol] = data;
            apiCache.symbolDetails.timestamp[symbol] = Date.now();
            
            return data;
        } catch (error) {
            console.error(`Error fetching symbol details for ${symbol}:`, error);
            return null;
        }
    }

    /**
     * Get current ticker data for a symbol
     */
    static async getTicker(symbol) {
        try {
            const response = await fetchWithProxyFallback(getApiUrl(`pubticker/${symbol}`));
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ticker for ${symbol}:`, error);
            return null;
        }
    }

    /**
     * Get ticker data (v2) with more detailed info
     * @param {string} symbol - Trading pair symbol
     * @returns {Promise<object>} Ticker v2 data from Gemini API
     */
    static async getTickerV2(symbol) {
        try {
            console.log(`Getting ticker v2 data for ${symbol}`);
            
            // URL encode the symbol to handle special characters
            const encodedSymbol = encodeURIComponent(symbol);
            // Create endpoint
            const endpoint = `ticker/${encodedSymbol}`;
            
            // Make the API request with proxy fallback
            const response = await fetchWithProxyFallback(getApiUrl(endpoint, true));
            
            // Parse the JSON response
            const data = await response.json();
            console.log(`Ticker v2 data for ${symbol}:`, data);
            
            // Return the ticker data
            return data;
        } catch (error) {
            console.error(`Error in getTickerV2 for ${symbol}:`, error);
            
            // Generate fallback data for the symbol
            const assetId = SYMBOL_TO_ASSET_ID[symbol] || symbol.replace('usd', '').toUpperCase();
            const fallback = FALLBACK_DATA[assetId];
            
            if (fallback) {
                console.log(`Using fallback data for ${symbol}`);
                // Create a synthetic ticker response with fallback data
                return {
                    symbol: symbol.toUpperCase(),
                    open: fallback.price_usd * 0.98, // Approximate open price
                    high: fallback.price_usd * 1.02, // Approximate high
                    low: fallback.price_usd * 0.97, // Approximate low
                    close: fallback.price_usd, // Current price from fallback
                    changes: [fallback.price_usd_change_percent_24h], // 24h percent change
                    bid: fallback.price_usd * 0.999, // Approximate bid
                    ask: fallback.price_usd * 1.001, // Approximate ask
                    volume: fallback.volume_1day_usd / fallback.price_usd, // Approximate volume in asset units
                };
            }
            
            // If no fallback data is available, return a minimal object
            return {
                symbol: symbol.toUpperCase(),
                open: 0,
                high: 0,
                low: 0,
                close: 0,
                changes: [0],
                bid: 0,
                ask: 0,
                volume: 0
            };
        }
    }

    /**
     * Get price candles for a symbol
     */
    static async getCandles(symbol, timeFrame) {
        try {
            // Create cache key
            const cacheKey = `${symbol}_${timeFrame}`;
            
            // Check cache
            if (apiCache.candles.data[cacheKey] && 
                (Date.now() - apiCache.candles.timestamp[cacheKey] < CACHE_TIMEOUT)) {
                return apiCache.candles.data[cacheKey];
            }
            
            const response = await fetchWithProxyFallback(getApiUrl(`candles/${symbol}/${timeFrame}`, true));
            
            const data = await response.json();
            
            // Update cache
            apiCache.candles.data[cacheKey] = data;
            apiCache.candles.timestamp[cacheKey] = Date.now();
            
            return data;
        } catch (error) {
            console.error(`Error fetching candles for ${symbol}:`, error);
            return null;
        }
    }

    /**
     * Get current order book for a symbol
     */
    static async getOrderBook(symbol, limitBids = 50, limitAsks = 50) {
        try {
            let endpoint = `book/${symbol}`;
            const params = [];
            
            if (limitBids !== 50) {
                params.push(`limit_bids=${limitBids}`);
            }
            
            if (limitAsks !== 50) {
                params.push(`limit_asks=${limitAsks}`);
            }
            
            if (params.length > 0) {
                endpoint += `?${params.join('&')}`;
            }
            
            const response = await fetchWithProxyFallback(getApiUrl(endpoint));
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching order book for ${symbol}:`, error);
            return { bids: [], asks: [] };
        }
    }

    /**
     * Get recent trades for a symbol
     */
    static async getTrades(symbol, limit = 50) {
        try {
            const endpoint = `trades/${symbol}?limit_trades=${limit}`;
            const response = await fetchWithProxyFallback(getApiUrl(endpoint));
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching trades for ${symbol}:`, error);
            return [];
        }
    }

    /**
     * Get price feed (current prices and 24h changes)
     */
    static async getPriceFeed() {
        try {
            // Check cache
            if (apiCache.priceFeeds && apiCache.priceFeeds.data && 
                (Date.now() - apiCache.priceFeeds.timestamp < CACHE_TIMEOUT)) {
                console.log("Using cached price feed data");
                return apiCache.priceFeeds.data;
            }
            
            console.log(`Attempting to fetch price feed from: ${getApiUrl('pricefeed')}`);
            const response = await fetchWithProxyFallback(getApiUrl('pricefeed'));
            
            const data = await response.json();
            console.log("Price feed successfully fetched from API:", data);
            
            // Update cache
            if (!apiCache.priceFeeds) {
                apiCache.priceFeeds = { data: null, timestamp: 0 };
            }
            apiCache.priceFeeds.data = data;
            apiCache.priceFeeds.timestamp = Date.now();
            
            return data;
        } catch (error) {
            console.error('Error fetching price feed:', error);
            
            // Generate synthetic price feed from fallback data
            console.log('Using synthetic price feed from fallback data');
            
            // Create a synthetic price feed using the FALLBACK_DATA
            const syntheticPriceFeed = Object.entries(FALLBACK_DATA).map(([assetId, data]) => {
                return {
                    pair: (assetId.toLowerCase() + 'usd').toUpperCase(),
                    price: data.price_usd.toString(),
                    percentChange24h: data.price_usd_change_percent_24h.toString()
                };
            });
            
            // Update cache with synthetic data
            if (!apiCache.priceFeeds) {
                apiCache.priceFeeds = { data: null, timestamp: 0 };
            }
            apiCache.priceFeeds.data = syntheticPriceFeed;
            apiCache.priceFeeds.timestamp = Date.now();
            
            return syntheticPriceFeed;
        }
    }

    /**
     * Calculate percent change between two values
     */
    static calculatePercentChange(startValue, endValue) {
        const start = parseFloat(startValue);
        const end = parseFloat(endValue);
        
        if (start === 0) return 0;
        
        return ((end - start) / start) * 100;
    }

    /**
     * Get top assets by market cap/volume (approximated from available data)
     */
    static async getTopAssets(limit = 10) {
        const assets = await this.getAssets();
        
        // Sort by price as a simple approximation (since we don't have market cap from Gemini)
        return assets
            .sort((a, b) => b.price_usd - a.price_usd)
            .slice(0, limit);
    }

    /**
     * Search for assets by name or symbol
     */
    static async searchAssets(query) {
        const assets = await this.getAssets();
        const searchTerm = query.toLowerCase();
        
        return assets.filter(asset => 
            asset.name.toLowerCase().includes(searchTerm) || 
            asset.asset_id.toLowerCase().includes(searchTerm)
        );
    }
}

// Initialize the cache
CryptoAPI.cache = {
    assets: null,
    lastUpdate: null,
    cacheTimeout: 3600000, // 1 hour
    ohlcv: {}
};

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