class PriceChart {
    constructor() {
        this.chart = null;
        this.initChart();
    }

    initChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Bitcoin (USD)',
                        data: [],
                        borderColor: '#F7931A',
                        tension: 0.1
                    },
                    {
                        label: 'Ethereum (USD)',
                        data: [],
                        borderColor: '#627EEA',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
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
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        this.startUpdating();
    }

    async updateChartData() {
        try {
            const prices = await api.getPrices();
            if (!prices) return;

            const now = new Date().toLocaleTimeString();
            
            // Update labels
            this.chart.data.labels.push(now);
            if (this.chart.data.labels.length > 20) {
                this.chart.data.labels.shift();
            }

            // Update Bitcoin data
            if (prices.bitcoin) {
                this.chart.data.datasets[0].data.push(prices.bitcoin.usd);
                if (this.chart.data.datasets[0].data.length > 20) {
                    this.chart.data.datasets[0].data.shift();
                }
            }

            // Update Ethereum data
            if (prices.ethereum) {
                this.chart.data.datasets[1].data.push(prices.ethereum.usd);
                if (this.chart.data.datasets[1].data.length > 20) {
                    this.chart.data.datasets[1].data.shift();
                }
            }

            this.chart.update();
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }

    startUpdating() {
        // Initial update
        this.updateChartData();
        
        // Update every 30 seconds
        setInterval(() => this.updateChartData(), 30000);
    }
}

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const priceChart = new PriceChart();
}); 