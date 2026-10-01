class ModersString extends String {
    #str = undefined

    constructor (str) {
        super(str)
        this.#str = String(str)
    }

    toNumber () {
        return Number(this.#str)
    }

    toObject () {
        return Object(this.#str)
    }

    toArray () {
        return Array(this.#str)
    }

    toBoolean () {
        return Boolean(this.#str)
    }

    replaceDate () {
        return this.#str
            .replaceAll("{{year}}", new Date().getFullYear())
            .replaceAll("{{month}}", new Date().getMonth())
            .replaceAll("{{day}}", new Date().getDate())
            .replaceAll("{{hour}}", new Date().getHours())
            .replaceAll("{{minute}}", new Date().getMinutes())
            .replaceAll("{{second}}", new Date().getSeconds())
            .replaceAll("{{millisecond}}", new Date().getMilliseconds())
            .replaceAll("{{nanosecond}}", new Date().getSeconds() / (1 * 1000 * 1000 * 1000))
    }

    get type () {
        return "modersstring"
    }

    toString () {
        return String(this.#str)
    }

    static isModersString (val) {
        return val.type === new ModersString(val).type
    }
}

class ModersNumber extends Number {
    #num = 0

    constructor (num) {
        super(num)
        this.#num = Number(num)
    }

    toBoolean () {
        return Boolean(this.#num)
    }

    toHex () {
        return this.#num.toString(16)
    }

    toBin () {
        return this.#num.toString(2)
    }

    fromHex () {
        return parseInt(this.#num, 16)
    }

    fromBin () {
        return parseInt(this.#num, 2)
    }

    get type () {
        return "modersnumber"
    }

    toNumber () {
        return Number(this.#num)
    }

    toString () {
        return String(this.#num)
    }

    static bin (num) {
        return num.toString(2)
    }

    static hex (num) {
        return num.toString(16)
    }

    static isModersNumber (val) {
        return val.type === new ModersNumber(val).type
    }
}

class ModersArray extends Array {
    #arr = undefined

    constructor (arr) {
        super(arr)
        this.#arr = Array.from(arr)
    }

    toObject () {
        return Object(this.#arr)
    }

    sortTop () {
        const sortedArr = this.#arr.toSorted((a, b) => b.reputation - a.reputation)
        return sortedArr
    }

    get type () {
        return "modersarray"
    }

    toArray () {
        return Array(this.#arr)
    }

    toString () {
        return String(this.#arr)
    }

    get sec () {
        return this.#arr
    }

    static isModersArray (val) {
        return val.type === new ModersArray(val).type
    }
}

class ModersObject extends Object {
    #obj = {}

    constructor (obj) {
        super(obj)
        this.#obj = Object(obj)
    }

    toMap () {
        const mapObject = new Map()
        const keysObj = Object.keys(this.#obj)
        for (let i = 0; i < keysObj.lenght; i++) {
            mapObject.set(keysObj[i], this.#obj[keysObj[i]])
        }
        return mapObject
    }

    keys () {
        return Object.keys(this.#obj)
    }

    values () {
        return Object.values(this.#obj)
    }

    set (k, v) {
        this.#obj[k] = v
        return this.#obj
    }

    get (k) {
        return this.#obj[k]
    }

    delete (k) {
        delete this.#obj[k]
        return this.#obj
    }

    get type () {
        return "modersobject"
    }

    toObject () {
        return Object(this.#obj)
    }

    toString () {
        return String(this.#obj)
    }

    static isModersObject (val) {
        return val.type === new ModersObject(val).type
    }
}

export {
    ModersString,
    ModersNumber,
    ModersArray,
    ModersObject
}