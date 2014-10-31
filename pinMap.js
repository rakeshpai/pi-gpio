var rev = require('./piRevision');

// physical pin to [bcm, wiring]
const bcmIndex = 0;
const wpiIndex = 1;
const pinMap = {
    "3": (rev === 2 ? [2, 8] : [0, 8]),
    "5": (rev === 2 ? [5, 9] : [1, 9]),
    "7": [4, 7],
    "8": [14, 15],
    "10": [15, 16],
    "11": [17, 0],
    "12": [18, 1],
    "13": (rev === 2 ? [27, 2]: [21, 2]),
    "15": [22, 3],
    "16": [23, 4],
    "18": [24, 5],
    "19": [10, 12],
    "21": [9,  13],
    "22": [25, 6],
    "23": [11, 14],
    "24": [8,  10],
    "26": [7,  11],

    // Model  B+ pins
    "29": [5,  21],
    "31": [6,  22],
    "32": [12, 26],
    "33": [13, 23],
    "35": [19, 24],
    "36": [16, 27],
    "37": [26, 25],
    "38": [20, 28],
    "40": [21, 29]
};

function convert(pinNumber, mapIndex) {
    pinNumber = parseInt(pinNumber, 10);
    if (typeof pinNumber !== 'number') {
        throw new Error("Pin number isn't valid [1]");
    }
    if (typeof pinMap[pinNumber] !== 'object') {
        throw new Error("Pin number isn't valid [2]");
    }
    if (typeof pinMap[pinNumber][mapIndex] !== 'number') {
        throw new Error("Pin number isn't valid [3]");
    }
    return pinMap[pinNumber][mapIndex];
}

module.exports.physToBcm = function(physPin) {
    return convert(physPin, bcmIndex);
}

module.exports.physToWiring = function(physPin) {
    return convert(physPin, wpiIndex);
}
