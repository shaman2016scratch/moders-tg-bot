const MaxMin = (num, max, min) => {
    return Math.min(max, Math.max(min, num))
}

const getType = (val) => {
    return (typeof val === typeof {}) ? (Array.isArray(val) ? "array" : "object") : typeof val
}

const ModersCasts = {
    toString (val) {
        return String(val)
    },
    toNumber (val) {
        return Number(val)
    },
    toBoolean (val) {
        return Boolean(val)
    },
    toArray (val) {
        return Array(val)
    },
    toObject (val) {
        return Object(val)
    }
}

const ModersCast = (type, val) => {
    return (type === "string") ? String(val) : (
        (type === "number") ? Number(val) : (
            (type === "boolean") ? Boolean(val) : (
                (type === "object") ? Object(val) : (
                    (type === "array") ? Array(val) : null
                )
            )
        )
    )
}

const ModersUtils = {
    MaxMin,
    getType,
    ModersCasts,
    ModersCast
}

export {
    MaxMin,
    ModersUtils as default,
    getType,
    ModersCasts,
    ModersCast
}