class GamificationSystem {
    constructor() {
        this.xp = 0;
        this.level = 1;
        this.badges = new Set();
        
        this.xpElement = document.getElementById('userXP');
        this.levelElement = document.getElementById('userLevel');
    }

    addXP(amount) {
        this.xp += amount;
        this.checkLevel();
        this.updateUI();
    }

    checkLevel() {
        const newLevel = Math.floor(this.xp / 1000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.onLevelUp();
        }
    }

    onLevelUp() {
        alert(`Gefeliciteerd! Je bent nu level ${this.level}!`);
    }

    updateUI() {
        this.xpElement.textContent = this.xp;
        this.levelElement.textContent = this.level;
    }

    awardBadge(badgeName) {
        if (!this.badges.has(badgeName)) {
            this.badges.add(badgeName);
            alert(`Nieuwe badge verdiend: ${badgeName}!`);
        }
    }
}

const gamification = new GamificationSystem(); 