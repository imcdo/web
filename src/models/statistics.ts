
// Based on: https://github.com/cougargrades/api-2.0.0/blob/7f4601a97d08a017a907ad29c91479121f917c2a/functions/src/lib/statistics/index.js

export class GPA {
    average: number
    standardDeviation: number
    maximum: number
    minimum: number
    range: number
    median: number
    _average: Average
    _standardDeviation: StandardDeviation
    _mmr: MaxMinRange
    constructor(args: GPA) {
        this.average = args.average || 0
        this.standardDeviation = args.standardDeviation || 0
        this.maximum = args.maximum || 0
        this.minimum = args.minimum || 0
        this.range = args.range || 0
        this.median = args.median || 0
        this._average = new Average(args._average)
        this._standardDeviation = new StandardDeviation(args._standardDeviation)
        this._mmr = new MaxMinRange(this)
    }
    include(x: number) {
        this._average.include(x)
        this._standardDeviation.include(x)
        this._mmr.include(x)
        this.average = this._average.value()
        this.standardDeviation = this._standardDeviation.value()
        this.maximum = this._mmr.value().maximum
        this.minimum = this._mmr.value().minimum
        this.range = this._mmr.value().range
    }
    value() {
        return {
            average: this.average,
            standardDeviation: this.standardDeviation,
            maximum: this.maximum,
            minimum: this.minimum,
            range: this.range,
            median: this.median,
            _average: JSON.parse(JSON.stringify(this._average)),
            _standardDeviation: JSON.parse(JSON.stringify(this._standardDeviation))
        }
    }
}

export class Average {
    n: number
    sum: number
    constructor(args: Average) {
        this.n = args.n || 0
        this.sum = args.sum || 0
    }
    include(x: number) {
        this.n += 1
        this.sum += x
    }
    value() {
        return this.sum / this.n
    }
}

export class StandardDeviation {
    n: number
    delta: number
    mean: number
    M2: number
    ddof: number
    constructor(args: StandardDeviation) {
        this.n = args.n || 0
        this.delta = args.delta || 0
        this.mean = args.mean || 0
        this.M2 = args.M2 || 0
        this.ddof = args.ddof || 0
    }
    include(x: number) {
        this.n += 1
        this.delta = x - this.mean
        this.mean += this.delta / this.n
        this.M2 += this.delta * (x - this.mean)
    }
    value() {
        return Math.sqrt(this.M2 / (this.n - this.ddof))
    }
}

export class MaxMinRange {
    maximum: number
    minimum: number
    range: number
    constructor(args: MaxMinRange) {
        this.maximum = args.maximum || Number.MIN_VALUE
        this.minimum = args.minimum || Number.MAX_VALUE
        this.range = args.range || 0
    }
    include(x: number) {
        this.maximum = (this.maximum < x) ? x : this.maximum
        this.minimum = (this.minimum > x) ? x : this.minimum
        this.range = this.maximum - this.minimum
    }
    value() {
        return {
            maximum: this.maximum,
            minimum: this.minimum,
            range: this.range,
        }
    }
}
