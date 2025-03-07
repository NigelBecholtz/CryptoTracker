class GamificationSystem {
    constructor() {
        this.xp = 0;
        this.level = 1;
        this.badges = new Set();
        this.achievements = [];
        
        // Initialize UI elements
        this.xpElement = document.getElementById('userXP');
        this.levelElement = document.getElementById('userLevel');
        this.badgesElement = document.getElementById('userBadges');
        
        // Define achievements
        this.initializeAchievements();
    }

    initializeAchievements() {
        this.achievements = [
            {
                id: 'first_trade',
                name: 'First Trade',
                description: 'Complete your first trade',
                icon: 'fa-coins',
                xpReward: 100
            },
            {
                id: 'portfolio_diversity',
                name: 'Portfolio Diversity',
                description: 'Own 5 different cryptocurrencies',
                icon: 'fa-layer-group',
                xpReward: 250
            },
            {
                id: 'profit_master',
                name: 'Profit Master',
                description: 'Achieve 100% ROI on any trade',
                icon: 'fa-chart-line',
                xpReward: 500
            }
        ];
    }

    addXP(amount) {
        this.xp += amount;
        this.checkLevel();
        this.updateUI();
        this.saveProgress();
    }

    checkLevel() {
        const newLevel = Math.floor(this.xp / 1000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.onLevelUp();
        }
    }

    onLevelUp() {
        // Create and show level up notification
        const notification = document.createElement('div');
        notification.className = 'alert alert-success fixed top-4 right-4 z-50';
        notification.innerHTML = `
            <i class="fas fa-level-up-alt mr-2"></i>
            <span>Congratulations! You've reached level ${this.level}!</span>
        `;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);

        // Trigger any level-specific rewards
        this.checkLevelRewards();
    }

    checkLevelRewards() {
        const rewards = {
            5: { type: 'feature', name: 'Advanced Analytics' },
            10: { type: 'feature', name: 'AI Predictions' },
            15: { type: 'badge', name: 'Trading Expert' }
        };

        const reward = rewards[this.level];
        if (reward) {
            this.grantReward(reward);
        }
    }

    grantReward(reward) {
        if (reward.type === 'badge') {
            this.awardBadge(reward.name);
        } else if (reward.type === 'feature') {
            this.unlockFeature(reward.name);
        }
    }

    unlockFeature(featureName) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-info fixed top-4 right-4 z-50';
        notification.innerHTML = `
            <i class="fas fa-unlock mr-2"></i>
            <span>New feature unlocked: ${featureName}!</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    awardBadge(badgeName) {
        if (!this.badges.has(badgeName)) {
            this.badges.add(badgeName);
            
            // Show badge notification
            const notification = document.createElement('div');
            notification.className = 'alert alert-success fixed top-4 right-4 z-50';
            notification.innerHTML = `
                <i class="fas fa-award mr-2"></i>
                <span>New badge earned: ${badgeName}!</span>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);

            this.updateUI();
            this.saveProgress();
        }
    }

    updateUI() {
        if (this.xpElement) {
            this.xpElement.textContent = this.xp;
        }
        if (this.levelElement) {
            this.levelElement.textContent = this.level;
        }
        if (this.badgesElement) {
            this.updateBadgesUI();
        }
    }

    updateBadgesUI() {
        this.badgesElement.innerHTML = '';
        this.badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge badge-lg';
            badgeElement.innerHTML = `
                <i class="fas fa-award mr-2"></i>
                ${badge}
            `;
            this.badgesElement.appendChild(badgeElement);
        });
    }

    saveProgress() {
        const progress = {
            xp: this.xp,
            level: this.level,
            badges: Array.from(this.badges)
        };
        localStorage.setItem('cryptoTrackerProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('cryptoTrackerProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.xp = progress.xp;
            this.level = progress.level;
            this.badges = new Set(progress.badges);
            this.updateUI();
        }
    }

    // Trading related achievements
    onTradeComplete(tradeData) {
        // Check for first trade achievement
        if (!this.badges.has('First Trade')) {
            this.awardBadge('First Trade');
            this.addXP(100);
        }

        // Check profit achievements
        if (tradeData.roi >= 100) {
            this.awardBadge('Profit Master');
            this.addXP(500);
        }
    }

    // Portfolio related achievements
    checkPortfolioDiversity(portfolioCoins) {
        if (portfolioCoins.length >= 5 && !this.badges.has('Portfolio Diversity')) {
            this.awardBadge('Portfolio Diversity');
            this.addXP(250);
        }
    }
}

// Initialize gamification system
const gamification = new GamificationSystem();

// Load saved progress when the page loads
document.addEventListener('DOMContentLoaded', () => {
    gamification.loadProgress();
}); 