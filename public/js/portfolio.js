async function sellInvestment(investmentId) {
    if (!confirm('Are you sure you want to sell this investment?')) {
        return;
    }

    try {
        const response = await fetch('/api/investments/sell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                investment_id: investmentId
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            window.location.reload();
        } else {
            alert(data.error || 'Failed to sell investment');
        }
    } catch (error) {
        alert('Failed to process transaction');
    }
}