import './bootstrap';
import './crypto-chatbot';

// Set Hugging Face API token from Laravel environment variable
window.huggingFaceToken = document.querySelector('meta[name="huggingface-token"]')?.getAttribute('content') || '';

// Add this to your existing app.js file

// Check for wallet balance updates from session flash data
document.addEventListener('DOMContentLoaded', function() {
    // If there's a wallet balance update in the session
    if (typeof walletBalance !== 'undefined') {
        // Dispatch custom event to update wallet display
        document.dispatchEvent(new CustomEvent('wallet-updated', {
            detail: { balance: walletBalance }
        }));
    }
});
