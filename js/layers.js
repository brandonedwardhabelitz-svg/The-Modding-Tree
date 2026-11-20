addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
                if (hasUpgrade('p', 21)) mult = mult.times(2)
        if (hasUpgrade('p', 23)) mult = mult.times(upgradeEffect('p', 23))
        if (hasUpgrade('p', 32)) mult = mult.times(10)
        if (hasUpgrade('p', 42)) mult = mult.times(upgradeEffect('p', 42))
        if (hasUpgrade('p', 51)) mult = mult.times(1000)

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
            ],
	    upgrades: {
        
        // Row 1 (11-14)
        11: {
            title: "First Spark",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Momentum",
            description: "Triple your point gain.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("p", 11) },
        },
        13: {
            title: "Synergy",
            description: "Prestige points boost your point gain.",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("p", 12) },
            effect() { return player.p.points.add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        14: {
            title: "Self-Boost",
            description: "Points boost themselves!",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("p", 13) },
            effect() { return player.points.add(10).log10().pow(2) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },

        // Row 2 (21-24)
        21: {
            title: "Prestige Surge",
            description: "Double your prestige point gain.",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade("p", 14) },
        },
        22: {
            title: "Overdrive",
            description: "Multiply point gain by 10.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("p", 21) },
        },
        23: {
            title: "Feedback Loop",
            description: "Points boost prestige point gain.",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade("p", 22) },
            effect() { return player.points.add(10).log10().pow(1.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        24: {
            title: "Upgrade Power",
            description: "Each bought P upgrade doubles point gain.",
            cost: new Decimal(25000),
            unlocked() { return hasUpgrade("p", 23) },
            effect() { return Decimal.pow(2, player.p.upgrades.length) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },

        // Row 3 (31-34)
        31: {
            title: "Mega Multiplier",
            description: "Multiply point gain by 100.",
            cost: new Decimal(1e5),
            unlocked() { return hasUpgrade("p", 24) },
        },
        32: {
            title: "Prestige Nova",
            description: "Multiply prestige point gain by 10.",
            cost: new Decimal(1e6),
            unlocked() { return hasUpgrade("p", 31) },
        },
        33: {
            title: "Deep Synergy",
            description: "Prestige points boost point gain even harder.",
            cost: new Decimal(1e7),
            unlocked() { return hasUpgrade("p", 32) },
            effect() { return player.p.points.add(1).pow(0.75) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        34: {
            title: "Exponential Spark",
            description: "Raise point gain to the ^1.05.",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade("p", 33) },
        },

        // Row 4 (41-44)
        41: {
            title: "Billionaire Boost",
            description: "Multiply point gain by 1,000.",
            cost: new Decimal(1e11),
            unlocked() { return hasUpgrade("p", 34) },
        },
        42: {
            title: "Prestige Overflow",
            description: "Prestige points boost themselves!",
            cost: new Decimal(1e13),
            unlocked() { return hasUpgrade("p", 41) },
            effect() { return player.p.points.add(10).log10().pow(2.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        43: {
            title: "Hyper Scaling",
            description: "Each bought P upgrade multiplies point gain by 5x.",
            cost: new Decimal(1e16),
            unlocked() { return hasUpgrade("p", 42) },
            effect() { return Decimal.pow(5, player.p.upgrades.length) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        44: {
            title: "Second Exponent",
            description: "Raise point gain to the ^1.08.",
            cost: new Decimal(1e20),
            unlocked() { return hasUpgrade("p", 43) },
        },

        // Row 5 (51-54)
        51: {
            title: "Cosmic Surge",
            description: "Multiply prestige point gain by 1,000.",
            cost: new Decimal(1e25),
            unlocked() { return hasUpgrade("p", 44) },
        },
        52: {
            title: "Infinity Prep",
            description: "Multiply point gain by 1e10.",
            cost: new Decimal(1e30),
            unlocked() { return hasUpgrade("p", 51) },
        },
        53: {
            title: "Super Synergy",
            description: "Prestige points boost point gain massively.",
            cost: new Decimal(1e38),
            unlocked() { return hasUpgrade("p", 52) },
            effect() { return player.p.points.add(1).pow(1.2) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        54: {
            title: "Layer Mastery",
            description: "Raise point gain to the ^1.15 to unlock Layer 2!",
            cost: new Decimal(1e50),
            unlocked() { return hasUpgrade("p", 53) },
        },
    },


    layerShown(){return true}
})
