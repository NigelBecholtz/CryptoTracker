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
            default: '#3B82F6'
        };
        return colors[coinId] || colors.default;
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

        this.chart.update('none'); // 'none' voor betere performance
    }
} 