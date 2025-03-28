class CoinbaseWebSocket {
    constructor() {
        this.ws = null;
        this.subscriptions = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // 1 second
        this.isConnecting = false;
    }

    connect() {
        if (this.isConnecting) return;
        this.isConnecting = true;

        this.ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

        this.ws.onopen = () => {
            console.log('Connected to Coinbase WebSocket');
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            
            // Resubscribe to all channels
            if (this.subscriptions.size > 0) {
                this.subscribe(Array.from(this.subscriptions));
            }
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.ws.onclose = () => {
            console.log('Disconnected from Coinbase WebSocket');
            this.handleDisconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleDisconnect();
        };
    }

    handleDisconnect() {
        this.isConnecting = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.reconnectDelay *= 2; // Exponential backoff
            
            console.log(`Reconnecting in ${this.reconnectDelay/1000} seconds... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    subscribe(channels) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        const subscribeMessage = {
            type: 'subscribe',
            channels: channels.map(channel => ({
                name: channel,
                product_ids: ['BTC-USD', 'ETH-USD', 'SOL-USD'] // Add more pairs as needed
            }))
        };

        this.ws.send(JSON.stringify(subscribeMessage));
        
        // Add to subscriptions set
        channels.forEach(channel => this.subscriptions.add(channel));
    }

    unsubscribe(channels) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        const unsubscribeMessage = {
            type: 'unsubscribe',
            channels: channels
        };

        this.ws.send(JSON.stringify(unsubscribeMessage));
        
        // Remove from subscriptions set
        channels.forEach(channel => this.subscriptions.delete(channel));
    }

    handleMessage(data) {
        switch (data.type) {
            case 'ticker':
                this.handleTicker(data);
                break;
            case 'heartbeat':
                // Handle heartbeat if needed
                break;
            case 'subscriptions':
                console.log('Subscribed to:', data.channels);
                break;
            default:
                console.log('Received message:', data);
        }
    }

    handleTicker(data) {
        // Dispatch a custom event with the ticker data
        const event = new CustomEvent('coinbaseTicker', {
            detail: {
                product_id: data.product_id,
                price: parseFloat(data.price),
                volume_24h: parseFloat(data.volume_24h),
                low_24h: parseFloat(data.low_24h),
                high_24h: parseFloat(data.high_24h),
                timestamp: new Date(data.time)
            }
        });
        window.dispatchEvent(event);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.subscriptions.clear();
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
    }
}

// Export for use in other files
window.CoinbaseWebSocket = CoinbaseWebSocket; 