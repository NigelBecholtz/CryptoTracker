class PriceChart {
    constructor(canvasId, coinId) {
        this.canvasId = canvasId;
        this.coinId = coinId;
        this.chart = null;
        this.initChart();
    }

    initChart() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');
        const coinColor = this.getCoinColor(this.coinId);
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: `${this.coinId.charAt(0).toUpperCase() + this.coinId.slice(1)} (USD)`,
                        data: [],
                        borderColor: coinColor,
                        backgroundColor: coinColor + '20',
                        tension: 0.1,
                        fill: true
                    }
                ]
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
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
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

    getCoinColor(coinId) {
        const colors = {
            bitcoin: '#F7931A',
            ethereum: '#627EEA',
            BTC: '#F7931A',
            ETH: '#627EEA',
            XRP: '#23292F',
            LTC: '#BFBBBB',
            ADA: '#3CC8C8',
            DOT: '#E6007A',
            default: '#3B82F6'
        };
        return colors[coinId] || colors.default;
    }

    async loadHistoricalData(days = 7) {
        try {
            // Map days to appropriate period_id
            let periodId = '1DAY';
            if (days <= 1) periodId = '1HRS';
            else if (days <= 7) periodId = '6HRS';
            
            const data = await CryptoAPI.getOHLCV(this.coinId, periodId, days);
            if (!data || !Array.isArray(data)) return;

            // Clear existing data
            this.chart.data.labels = [];
            this.chart.data.datasets[0].data = [];

            // Process and add historical data
            data.forEach((item) => {
                const date = new Date(item.time_period_start);
                this.chart.data.labels.push(date.toLocaleDateString());
                this.chart.data.datasets[0].data.push(item.rate_close);
            });

            this.chart.update();
        } catch (error) {
            console.error('Error loading historical data:', error);
        }
    }

    updateChartData(price) {
        if (!price) return;

        const now = new Date().toLocaleTimeString();
        
        // Update labels
        this.chart.data.labels.push(now);
        if (this.chart.data.labels.length > 20) {
            this.chart.data.labels.shift();
        }

        // Update price data
        this.chart.data.datasets[0].data.push(price);
        if (this.chart.data.datasets[0].data.length > 20) {
            this.chart.data.datasets[0].data.shift();
        }

        this.chart.update('none'); // 'none' for better performance
    }
}

// Chart Manager for handling multiple charts
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.updateInterval = null;
    }

    createChart(canvasId, coinId) {
        const chart = new PriceChart(canvasId, coinId);
        this.charts.set(coinId, chart);
        
        // Load initial historical data
        chart.loadHistoricalData();

        // Start real-time updates if not already running
        this.startRealTimeUpdates();

        return chart;
    }

    removeChart(coinId) {
        const chart = this.charts.get(coinId);
        if (chart) {
            chart.chart.destroy();
            this.charts.delete(coinId);
        }

        // Stop updates if no charts remain
        if (this.charts.size === 0 && this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async updateAllCharts() {
        // Only proceed if we have charts to update
        if (this.charts.size === 0) return;

        // Get all coin IDs we need to update
        const coinIds = Array.from(this.charts.keys());
        
        // Fetch latest prices for each coin
        for (const coinId of coinIds) {
            try {
                const asset = await CryptoAPI.getAsset(coinId);
                if (asset && asset.price_usd) {
                    const chart = this.charts.get(coinId);
                    if (chart) {
                        chart.updateChartData(asset.price_usd);
                    }
                }
            } catch (error) {
                console.error(`Error updating chart for ${coinId}:`, error);
            }
        }
    }

    startRealTimeUpdates() {
        // Only start if not already running
        if (this.updateInterval) return;
        
        // Update immediately
        this.updateAllCharts();
        
        // Then set interval for future updates (every 30 seconds)
        this.updateInterval = setInterval(() => {
            this.updateAllCharts();
        }, 30000);
    }
}

// Initialize chart manager
const chartManager = new ChartManager();

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with charts
    const chartElements = document.querySelectorAll('[data-crypto-chart]');
    if (chartElements.length > 0) {
        chartElements.forEach(element => {
            const coinId = element.getAttribute('data-coin-id');
            const canvasId = element.id;
            if (coinId && canvasId) {
                chartManager.createChart(canvasId, coinId);
            }
        });
    }
}); 