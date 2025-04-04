/**
 * Updates the wallet balance display across the site
 * @param {number} newBalance - The new wallet balance
 */
function updateWalletDisplay(newBalance) {
    // Format the balance with 2 decimal places
    const formattedBalance = '€' + parseFloat(newBalance).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Update all elements with the wallet-balance class
    document.querySelectorAll('.wallet-balance').forEach(element => {
        element.textContent = formattedBalance;
    });
    
    // Update the larger wallet balance display on portfolio page
    document.querySelectorAll('.wallet-balance-large').forEach(element => {
        element.textContent = formattedBalance;
    });
    
    // Update trading available balance if on markets page
    const tradingBalanceElement = document.getElementById('trading_available_balance');
    if (tradingBalanceElement) {
        tradingBalanceElement.textContent = formattedBalance;
    }
    
    // Update max amount in trading modal
    const maxAmountElement = document.getElementById('trading_max_amount');
    if (maxAmountElement) {
        maxAmountElement.textContent = parseFloat(newBalance).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    console.log('Wallet balance updated to:', formattedBalance);
}

// Check for wallet balance updates from flash messages
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a flash message with wallet balance
    const flashMessage = document.querySelector('.alert-success');
    if (flashMessage) {
        // Look for a data attribute with the new balance
        const newBalance = flashMessage.getAttribute('data-wallet-balance');
        if (newBalance) {
            updateWalletDisplay(newBalance);
        }
    }
});

// Listen for custom events that might be triggered after transactions
document.addEventListener('wallet-updated', function(event) {
    if (event.detail && event.detail.balance) {
        updateWalletDisplay(event.detail.balance);
    }
});