class CryptoAPI {
    constructor() {
        this.baseUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.coingecko.com/api/v3');
        this.charts = new Map(); // Opslag voor alle grafieken
        this.activeCharts = new Set(); // Bijhouden welke grafieken zichtbaar zijn
        this.lastUpdate = 0;
        this.updateInterval = 10000; // 10 seconden tussen updates
        this.previousPrices = {};
    }

    async getPrices(coins = ['bitcoin', 'ethereum'], currency = 'usd') {
        try {
            // Check rate limiting
            const now = Date.now();
            if (now - this.lastUpdate < this.updateInterval) {
                return null;
            }
            this.lastUpdate = now;

            const response = await fetch(
                `${this.baseUrl}/simple/price?ids=${coins.join(',')}&vs_currencies=${currency}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 429) {
                    console.log('Rate limit bereikt, wacht even...');
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Update actieve grafieken
            this.updateActiveCharts(data);
            
            return data;
        } catch (error) {
            console.error('Error fetching prices:', error);
            return null;
        }
    }

    updateActiveCharts(prices) {
        if (!prices) return;
        
        this.activeCharts.forEach(coinId => {
            if (this.charts.has(coinId) && prices[coinId]) {
                const chart = this.charts.get(coinId);
                chart.updateChartData(prices[coinId]?.usd);
            }
        });
    }

    async updateDashboard() {
        const prices = await this.getPrices();
        if (!prices) return;

        // Update Top Cryptocurrencies
        const topCryptos = document.querySelector('.card:nth-child(2) .space-y-2');
        if (topCryptos) {
            Object.entries(prices).forEach(([coin, price]) => {
                const previousPrice = this.previousPrices?.[coin]?.usd || price.usd;
                const percentChange = ((price.usd - previousPrice) / previousPrice) * 100;
                const changeClass = percentChange >= 0 ? 'text-green-500' : 'text-red-500';
                const changeSymbol = percentChange >= 0 ? '+' : '';

                const cryptoElement = topCryptos.querySelector(`[data-coin="${coin}"]`) || 
                    createCryptoElement(coin);
                
                cryptoElement.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <img src="https://cryptologos.cc/logos/${coin}-${getCoinSymbol(coin)}-logo.png" 
                             alt="${coin}" class="w-8 h-8" />
                        <span>${capitalize(coin)}</span>
                    </div>
                    <div class="text-right">
                        <div>$${price.usd.toLocaleString()}</div>
                        <div class="${changeClass} text-sm">${changeSymbol}${percentChange.toFixed(2)}%</div>
                    </div>
                `;

                if (!cryptoElement.parentElement) {
                    topCryptos.appendChild(cryptoElement);
                }
            });
        }

        // Update Market Table
        this.updateMarketTable(prices);

        this.previousPrices = prices;
    }

    updateMarketTable(prices) {
        const tableBody = document.querySelector('.table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        Object.entries(prices).forEach(([coin, price], index) => {
            const previousPrice = this.previousPrices?.[coin]?.usd || price.usd;
            const percentChange = ((price.usd - previousPrice) / previousPrice) * 100;
            const changeClass = percentChange >= 0 ? 'text-green-500' : 'text-red-500';
            const changeSymbol = percentChange >= 0 ? '+' : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div class="flex items-center space-x-3">
                        <img src="https://cryptologos.cc/logos/${coin}-${getCoinSymbol(coin)}-logo.png" 
                             alt="${coin}" class="w-8 h-8" />
                        <div>
                            <div class="font-bold">${capitalize(coin)}</div>
                            <div class="text-sm opacity-50">${getCoinSymbol(coin)}</div>
                        </div>
                    </div>
                </td>
                <td>$${price.usd.toLocaleString()}</td>
                <td class="${changeClass}">${changeSymbol}${percentChange.toFixed(2)}%</td>
                <td>$${(price.usd * 1000000).toLocaleString()}M</td>
                <td>
                    <div class="flex items-center space-x-2">
                        <button class="btn btn-xs btn-primary">
                            <i class="fas fa-plus mr-1"></i>Track
                        </button>
                        <button class="btn btn-xs btn-ghost btn-square">
                            <i class="fas fa-star text-yellow-500"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Helper functies
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCoinSymbol(coin) {
    const symbols = {
        bitcoin: 'btc',
        ethereum: 'eth'
    };
    return symbols[coin] || coin;
}

function createCryptoElement(coin) {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center';
    div.setAttribute('data-coin', coin);
    return div;
}

const api = new CryptoAPI();

// Update dashboard elke 10 seconden
setInterval(() => {
    if (document.visibilityState === 'visible') {
        api.updateDashboard();
    }
}, 10000);

// Initial update
api.updateDashboard(); 