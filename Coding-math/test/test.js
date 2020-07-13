let a = new Date()

Date.prototype.toString = function () {
    console.log('string')
}
Date.prototype.valueOf = function () {
        console.log('valueOf')
    }
    // Number(a)
    +
    a