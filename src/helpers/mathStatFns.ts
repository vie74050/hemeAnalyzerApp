// helper math functions
function getMean(array: number[]): number {
    const n = array.length;
    return array.reduce((a, b) => a + b) / n;
}

function getStandardDeviation(array: number[]): number {
    const n = array.length;
    const mean = this.getMean(array);
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}
function getCV(array: number[]): number {
    const mean = this.getMean(array);
    const sd = this.getStandardDeviation(array);
    return sd / mean;
}

export { getMean, getStandardDeviation, getCV };