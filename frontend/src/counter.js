let counter = 0;
function countInc() {
    counter++;
}
function getCounter() {
    return new Date().getMilliseconds();
}

module.exports = { countInc, getCounter }