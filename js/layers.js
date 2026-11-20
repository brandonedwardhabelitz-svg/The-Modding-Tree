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
        if (hasUpgrade('op', 12)) mult = mult.pow(1.5)
        if (hasUpgrade('op', 21)) mult = mult.pow(2.5)

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
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("op", 0) && resettingLayer == "op") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    passiveGeneration() {
        return hasMilestone("op", 1) ? 1 : 0
    },


    layerShown(){return true}
})

addLayer("op", {
    name: "omega prestige",
    symbol: "OP",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#9D4EDD",
    requires: new Decimal("1e20000000"),
    resource: "omega prestige points",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "normal",
    exponent: 0.0000001,
    branches: ["p"],
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade("op", 13)) mult = mult.times(upgradeEffect("op", 13))
        if (hasUpgrade("op", 22)) mult = mult.times(upgradeEffect("op", 22))
        if (hasUpgrade("op", 31)) mult = mult.times(1000)
                if (hasUpgrade("op", 42)) mult = mult.pow(10)
        if (hasUpgrade("op", 51)) mult = mult.tetrate(1.5)

        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "o", description: "O: Reset for omega prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "1 Omega Prestige Point",
            effectDescription: "Keep all 20 Prestige upgrades on Omega reset!",
            done() { return player.op.points.gte(1) }
        },
        1: {
            requirementDescription: "5 Omega Prestige Points",
            effectDescription: "Gain 100% of your Prestige point gain every second automatically!",
            done() { return player.op.points.gte(5) }
        },
        2: {
            requirementDescription: "25 Omega Prestige Points",
            effectDescription: "Unlock the final row of Omega upgrades to reach 1.00 Mec!",
            done() { return player.op.points.gte(25) }
        },
    },
    upgrades: {
        11: {
            title: "Omega Awakening",
            description: "Raise point gain to the ^1.5.",
            cost: new Decimal(1),
        },
        12: {
            title: "Omega Prestige",
            description: "Raise prestige point gain to the ^1.5.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("op", 11) },
        },
        13: {
            title: "Omega Synergy",
            description: "Omega Prestige points boost themselves!",
            cost: new Decimal(4),
            unlocked() { return hasUpgrade("op", 12) },
            effect() { return player.op.points.add(1).pow(0.75) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        14: {
            title: "Tetration Spark",
            description: "Raise point gain to the ^2.",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade("op", 13) },
        },
        21: {
            title: "Nano Breaker",
            description: "Raise prestige point gain to the ^2.5.",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade("op", 14) },
        },
        22: {
            title: "Point Resonance",
            description: "Your points boost Omega Prestige point gain.",
            cost: new Decimal(30),
            unlocked() { return hasUpgrade("op", 21) },
            effect() { return player.points.add(10).log10().add(1).pow(0.25) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        23: {
            title: "Pico Surge",
            description: "Raise point gain to the ^5.",
            cost: new Decimal(75),
            unlocked() { return hasUpgrade("op", 22) },
        },
        24: {
            title: "Femto Overdrive",
            description: "Raise point gain to the ^15.",
            cost: new Decimal(200),
            unlocked() { return hasUpgrade("op", 23) },
        },
        31: {
            title: "Atto Ascension",
            description: "Multiply Omega Prestige gain by 1,000.",
            cost: new Decimal(500),
            unlocked() { return hasMilestone("op", 2) && hasUpgrade("op", 24) },
        },
        32: {
            title: "Zepto Tower",
            description: "Raise point gain to the ^100.",
            cost: new Decimal(1e5),
            unlocked() { return hasUpgrade("op", 31) },
        },
        33: {
            title: "Yocto Singularity",
            description: "Raise point gain to the ^1,000.",
            cost: new Decimal(1e8),
            unlocked() { return hasUpgrade("op", 32) },
        },
        34: {
            title: "Mecca Horizon",
            description: "Raise point gain to the ^10,000 to reach 1.00 Mec (ee33)!",
            cost: new Decimal(1e12),
            unlocked() { return hasUpgrade("op", 33) },
        },        41: {
            title: "Duec Ascension",
            description: "Raise point gain to the ^1,000,000.",
            cost: new Decimal("1e20"),
            unlocked() { return hasUpgrade("op", 34) },
        },
        42: {
            title: "Icos Explosion",
            description: "Raise point exponent to the ^10 and Omega gain to the ^10.",
            cost: new Decimal("1e50"),
            unlocked() { return hasUpgrade("op", 41) },
        },
        43: {
            title: "Triple-e Omega",
            description: "Raise point exponent to the ^1,000.",
            cost: new Decimal("1e300"),
            unlocked() { return hasUpgrade("op", 42) },
        },
        44: {
            title: "Omega Tetration I",
            description: "Tetrate point gain by 1.2.",
            cost: new Decimal("ee5"),
            unlocked() { return hasUpgrade("op", 43) },
        },
        51: {
            title: "Omega Tetration II",
            description: "Tetrate point gain by 1.5 and Omega gain by 1.5.",
            cost: new Decimal("ee15"),
            unlocked() { return hasUpgrade("op", 44) },
        },
        52: {
            title: "Omega Tetration III",
            description: "Tetrate point gain by 2.0.",
            cost: new Decimal("eee5"),
            unlocked() { return hasUpgrade("op", 51) },
        },
        53: {
            title: "Omega Tetration IV",
            description: "Tetrate point gain by 2.5.",
            cost: new Decimal("eee15"),
            unlocked() { return hasUpgrade("op", 52) },
        },
        54: {
            title: "Omega Tetration V",
            description: "Tetrate point gain by 3.0.",
            cost: new Decimal("eee50"),
            unlocked() { return hasUpgrade("op", 53) },
        },
        61: {
            title: "Hyper-Omega VI",
            description: "Tetrate point gain by 3.5.",
            cost: new Decimal("eeee5"),
            unlocked() { return hasUpgrade("op", 54) },
        },
        62: {
            title: "eeee9e5 Omega Finale",
            description: "Tetrate point gain by 4.5 to shatter eeee9e5!",
            cost: new Decimal("eeee15"),
            unlocked() { return hasUpgrade("op", 61) },
        },
        63: {
            title: "Tower Climber I",
            description: "Add +500 to your point tower height (F) every second!",
            cost: new Decimal("1F10"),
            unlocked() { return hasUpgrade("op", 62) },
        },
        64: {
            title: "Tower Multiplier II",
            description: "Multiply your point tower height (F) by 10x.",
            cost: new Decimal("1F500"),
            unlocked() { return hasUpgrade("op", 63) },
        },
        71: {
            title: "Tower Surge III",
            description: "Multiply your point tower height (F) by 50x.",
            cost: new Decimal("1F5000"),
            unlocked() { return hasUpgrade("op", 64) },
        },
        72: {
            title: "F1,000,000 Finale",
            description: "Square your point tower height (F^2) to shatter 1F1,000,000!",
            cost: new Decimal("1F10000"),
            unlocked() { return hasUpgrade("op", 71) },
        },
        73: {
            title: "10^^1e308 Singularity",
            description: "Push your tower height to 10^^1e308 — the absolute limit of break_eternity.js!",
            cost: new Decimal("1F1e100"),
            unlocked() { return hasUpgrade("op", 72) },
        },

    },
    layerShown() { return player.p.unlocked || player.op.unlocked }
})

