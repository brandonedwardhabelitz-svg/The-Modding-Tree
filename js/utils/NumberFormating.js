function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}

function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !== 0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function standardTierName(t) {
    if (t <= 0) return ""
    let ones = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
    let tens = ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Ocg", "Nog"]
    let hundreds = ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]
    let rem = t % 1000
    let low = ones[rem % 10] + tens[Math.floor(rem / 10) % 10] + hundreds[Math.floor(rem / 100) % 10]
    let hi = Math.floor(t / 1000)
    if (hi === 0) return low
    let big = ["", "Mi", "Mc", "Na", "Pc", "Fm", "At", "Zp", "Yc", "Xn", "Vec", "Mec"]
    let out = ""
    let idx = 1
    while (hi > 0 && idx < big.length) {
        let chunk = hi % 1000
        if (chunk > 0) {
            let prefix = chunk === 1 ? "" : standardTierName(chunk)
            out = prefix + big[idx] + (out ? "-" + out : "")
        }
        hi = Math.floor(hi / 1000)
        idx++
    }
    return out + (low ? "-" + low : "")
}
function standardFormat(decimal, precision) {
    let e = decimal.log10().floor()
    let tier = e.div(3).floor()
    if (tier.lt(10)) {
        let suffix = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"][tier.toNumber()]
        let mantissa = decimal.div(Decimal.pow(10, tier.mul(3)))
        return mantissa.toStringWithDecimalPlaces(precision) + " " + suffix
    }
    if (tier.lt(1e12)) {
        let suffix = standardTierName(tier.sub(1).toNumber())
        let mantissa = decimal.div(Decimal.pow(10, tier.mul(3)))
        return mantissa.toStringWithDecimalPlaces(precision) + " " + suffix
    }
    let exp3 = tier.log10().div(3).floor().toNumber()
    let big = [
        "", "Mi", "Mc", "Na", "Pc", "Fm", "At", "Zp", "Yc", "Xn",
        "Vec", "Mec", "Duec", "Trec", "Tetrec", "Pentec", "Hexec", "Heptec", "Octec", "Ennec",
        "Ic", "UIc", "DIc", "TIc", "QaIc", "QiIc", "SxIc", "SpIc", "OcIc", "NoIc",
        "Trc", "UTrc", "DTrc", "TTrc", "QaTrc", "QiTrc", "SxTrc", "SpTrc", "OcTrc", "NoTrc",
        "Tec", "UTec", "DTec", "TTec", "QaTec", "QiTec", "SxTec", "SpTec", "OcTec", "NoTec",
        "Pec", "UPec", "DPec", "TPec", "QaPec", "QiPec", "SxPec", "SpPec", "OcPec", "NoPec",
        "Hxc", "UHxc", "DHxc", "THxc", "QaHxc", "QiHxc", "SxHxc", "SpHxc", "OcHxc", "NoHxc",
        "Hpc", "UHpc", "DHpc", "THpc", "QaHpc", "QiHpc", "SxHpc", "SpHpc", "OcHpc", "NoHpc",
        "Occ", "UOcc", "DOcc", "TOcc", "QaOcc", "QiOcc", "SxOcc", "SpOcc", "OcOcc", "NoOcc",
        "Enc", "UEnc", "DEnc", "TEnc", "QaEnc", "QiEnc", "SxEnc", "SpEnc", "OcEnc", "NoEnc",
        "Hc"
    ]
    if (exp3 < big.length) {
        let lead = tier.div(Decimal.pow(1000, exp3)).floor().toNumber()
        let prefix = lead === 1 ? "" : standardTierName(lead)
        return prefix + big[exp3]
    }
    let hyper = [
        { min: 100, name: "Hc" },
        { min: 200, name: "Dhc" },
        { min: 300, name: "Trhc" },
        { min: 400, name: "Tehc" },
        { min: 500, name: "Pehc" },
        { min: 600, name: "Hxhc" },
        { min: 700, name: "Hphc" },
        { min: 800, name: "Ochc" },
        { min: 900, name: "Enhc" },
        { min: 1000, name: "Kl" },
        { min: 1000000, name: "Kal" },
        { min: 1e9, name: "Mej" },
        { min: 1e12, name: "Gij" },
        { min: 1e15, name: "Ast" },
        { min: 1e18, name: "Lun" },
        { min: 1e21, name: "Ferm" },
        { min: 1e24, name: "Jov" },
        { min: 1e27, name: "Sol" },
        { min: 1e30, name: "Bet" },
        { min: 1e33, name: "Gloc" },
        { min: 1e36, name: "Gax" },
        { min: 1e39, name: "Sup" },
        { min: 1e42, name: "Vers" },
        { min: 1e45, name: "Mult" }
    ]
    let chosen = hyper[0]
    for (let i = 0; i < hyper.length; i++) {
        if (exp3 >= hyper[i].min) chosen = hyper[i]
    }
    let lead = Math.floor(exp3 / chosen.min)
    let prefix = (lead <= 1 || lead >= 1000) ? "" : standardTierName(lead)
    return prefix + chosen.name
}

function format(decimal, precision = 2, small) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("ee3e46") && decimal.lt("1F1e300")) return "e" + format(decimal.log10(), precision)
    else if (decimal.gte(1e9) && decimal.lt("1F1e300")) return standardFormat(decimal, precision)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")) {
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else
        return format(decimal, precision) + "⁻¹"
}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

function formatSmall(x, precision = 2) {
    return format(x, precision, true)
}

function invertOOM(x) {
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)
    return x
}
