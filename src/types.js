class ModersString extends String {
    #str = undefined

    constructor (str) {
        super(str)
        this.#str = str
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
}

class ModersNumber extends Number {
    #num = 0

    constructor (num) {
        super(num)
        this.#num = num
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

    static bin (num) {
        return num.toString(2)
    }

    static hex (num) {
        return num.toString(16)
    }
}

class ModersArray extends Array {
    #arr = undefined

    constructor (arr) {
        super(arr)
        this.#arr = arr
    }

    toObject () {
        return Object(this.#arr)
    }

    sortTop (val) {
        const sortedArr = this.#arr.toSorted((a, b) => b.reputation - a.reputation)
        return sortedArr
    }
}

class ModersObject extends Object {
    #obj = {}

    constructor (obj) {
        super(obj)
        this.#obj = obj
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
}

export {
    ModersString,
    ModersNumber,
    ModersArray,
    ModersObject
}