import { ModersArray, ModersObject } from "./types.js"

const MaxMin = (num, max, min) => {
    return Math.min(max, Math.max(min, num))
}

const getType = (val) => {
    return (typeof val === typeof {}) ? (
        ModersArray.isModersArray(val) ? "modersarray" : 
            (ModersObject.isModersObject(val) ? "modersobject" : 
                (Array.isArray(val) ? "array" : "object")
            )
    ) : typeof val
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
    },
    toModersArray (val) {
        return new ModersArray(val)
    },
    toModersObject (val) {
        return new ModersObject(val)
    }
}

const ModersCast = (type, val) => {
    return (type === "string") ? String(val) : (
        (type === "number") ? Number(val) : (
            (type === "boolean") ? Boolean(val) : (
                (type === "object") ? ( (val.type === "modersobject") ? val.toObject() : Object(val) ) : (
                    (type === "array") ? ( (val.type === "modersarray") ? val.toArray() : Array(val) ) : (
                        (type === "modersobject") ? new ModersObject(val) : (
                            (type === "modersarray") ? new ModersArray(val) : null
                        )
                    )
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