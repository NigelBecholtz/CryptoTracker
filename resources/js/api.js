class CryptoAPI {
    constructor() {
        this.baseUrl = 'https://api.coingecko.com/api/v3';
    }

    async getPrices(coins = ['bitcoin', 'ethereum'], currency = 'usd') {
        try {
            const response = await fetch(
                `${this.baseUrl}/simple/price?ids=${coins.join(',')}&vs_currencies=${currency}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching prices:', error);
            return null;
        }
    }

    async updatePriceList() {
        const priceList = document.getElementById('priceList');
        const prices = await this.getPrices();
        
        if (prices) {
            priceList.innerHTML = '';
            Object.entries(prices).forEach(([coin, price]) => {
                const priceElement = document.createElement('div');
                priceElement.className = 'flex justify-between items-center p-3 bg-gray-50 rounded';
                priceElement.innerHTML = `
                    <span class="capitalize">${coin}</span>
                    <span class="font-bold">$${price.usd}</span>
                `;
                priceList.appendChild(priceElement);
            });
        }
    }
}

const api = new CryptoAPI();
// Update prijzen elke 30 seconden
setInterval(() => api.updatePriceList(), 30000);
// Initial update
api.updatePriceList(); 