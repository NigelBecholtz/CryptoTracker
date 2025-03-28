class CoinbaseWebSocket {
    constructor() {
        this.ws = null;
        this.subscriptions = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // 1 second
        this.isConnecting = false;
        this.productIds = [
            // Layer 1 Blockchains
            'BTC-USD',    // Bitcoin
            'ETH-USD',    // Ethereum
            'SOL-USD',    // Solana
            'ADA-USD',    // Cardano
            'DOT-USD',    // Polkadot
            'AVAX-USD',   // Avalanche
            'ATOM-USD',   // Cosmos
            'XTZ-USD',    // Tezos
            'ALGO-USD',   // Algorand
            'EOS-USD',    // EOS
            'ETC-USD',    // Ethereum Classic
            'XLM-USD',    // Stellar
            'XRP-USD',    // Ripple
            'LTC-USD',    // Litecoin
            'BCH-USD',    // Bitcoin Cash
            'DASH-USD',   // Dash
            'ZEC-USD',    // Zcash
            'FIL-USD',    // Filecoin
            'ICX-USD',    // ICON
            'SGB-USD',    // Songbird

            // DeFi & Smart Contract Platforms
            'AAVE-USD',   // Aave
            'COMP-USD',   // Compound
            'UNI-USD',    // Uniswap
            'SUSHI-USD',  // SushiSwap
            'CRV-USD',    // Curve
            'BAL-USD',    // Balancer
            'MKR-USD',    // Maker
            'SNX-USD',    // Synthetix
            'YFI-USD',    // Yearn Finance
            'UMA-USD',    // UMA
            'REN-USD',    // Ren
            'REP-USD',    // Augur
            'NMR-USD',    // Numeraire
            'NU-USD',     // NuCypher
            'OXT-USD',    // Orchid
            'SKL-USD',    // Skale
            'STORJ-USD',  // Storj
            'ZRX-USD',    // 0x
            'KNC-USD',    // Kyber Network
            'LRC-USD',    // Loopring
            'BNT-USD',    // Bancor
            'CGLD-USD',   // Celo
            'CTSI-USD',   // Cartesi
            'DNT-USD',    // District0x
            'GNT-USD',    // Golem
            'GRT-USD',    // The Graph
            'MANA-USD',   // Decentraland
            'SAND-USD',   // The Sandbox
            'OMG-USD',    // OMG Network
            'PAX-USD',    // Paxos Standard
            'TUSD-USD',   // TrueUSD
            'USDC-USD',   // USD Coin
            'USDT-USD',   // Tether
            'WBTC-USD',   // Wrapped Bitcoin

            // Meme & Social Coins
            'DOGE-USD',   // Dogecoin
            'SHIB-USD',   // Shiba Inu
            'BAT-USD',    // Basic Attention Token

            // Gaming & Metaverse
            'AXS-USD',    // Axie Infinity
            'ENJ-USD',    // Enjin
            'ILV-USD',    // Illuvium
            'SAND-USD',   // The Sandbox
            'MANA-USD',   // Decentraland

            // Privacy Coins
            'ZEC-USD',    // Zcash
            'DASH-USD',   // Dash
            'XMR-USD',    // Monero

            // Stablecoins
            'USDC-USD',   // USD Coin
            'USDT-USD',   // Tether
            'TUSD-USD',   // TrueUSD
            'PAX-USD',    // Paxos Standard
            'DAI-USD',    // Dai
            'BUSD-USD',   // Binance USD

            // Exchange Tokens
            'BNB-USD',    // Binance Coin
            'CRO-USD',    // Crypto.com Coin
            'OKB-USD',    // OKB
            'KCS-USD',    // KuCoin Token

            // Infrastructure & IoT
            'IOTX-USD',   // IoTeX
            'HNT-USD',    // Helium
            'ANKR-USD',   // Ankr
            'RNDR-USD',   // Render Network

            // AI & Big Data
            'AGIX-USD',   // SingularityNET
            'OCEAN-USD',  // Ocean Protocol
            'FET-USD',    // Fetch.ai
            'GRT-USD',    // The Graph

            // Layer 2 Solutions
            'MATIC-USD',  // Polygon
            'OP-USD',     // Optimism
            'ARB-USD',    // Arbitrum
            'IMX-USD',    // Immutable X
            'LRC-USD',    // Loopring

            // Cross-Chain & Interoperability
            'DOT-USD',    // Polkadot
            'ATOM-USD',   // Cosmos
            'LINK-USD',   // Chainlink
            'REN-USD',    // Ren
            'CGLD-USD',   // Celo

            // DeFi Lending & Borrowing
            'AAVE-USD',   // Aave
            'COMP-USD',   // Compound
            'MKR-USD',    // Maker
            'SNX-USD',    // Synthetix
            'YFI-USD'     // Yearn Finance
        ];
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
            
            // Subscribe to ticker channel for all product IDs
            this.subscribe(['ticker']);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
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
                product_ids: this.productIds
            }))
        };

        console.log('Subscribing with message:', subscribeMessage);
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
            case 'error':
                console.error('WebSocket error:', data.message);
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