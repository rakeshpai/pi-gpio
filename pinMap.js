var fs = require('fs');

var rev = fs.readFileSync("/proc/cpuinfo").toString().split("\n").filter(function(line) {
              return line.indexOf("Revision") == 0;
          })[0].split(":")[1].trim();

rev = parseInt(rev, 16) < 3 ? 1 : 2; // http://elinux.org/RPi_HardwareHistory#Board_Revision_History

const baseMap = {
    "3": 0,
    "5": 1,
    "7": 4,
    "8": 14,
    "10": 15,
    "11": 17,
    "12": 18,
    "13": 21,
    "15": 22,
    "16": 23,
    "18": 24,
    "19": 10,
    "21": 9,
    "22": 25,
    "23": 11,
    "24": 8,
    "26": 7,

    // Model B+ pins
    "29": 5,
    "31": 6,
    "32": 12,
    "33": 13,
    "35": 19,
    "36": 16,
    "37": 26,
    "38": 20,
    "40": 21
};

var physToBcm = function() {
    var map = JSON.parse(JSON.stringify(baseMap));
    if (rev == 2) {
        map["3"] = 2;
        map["5"] = 3;
        map["13"] = 27;
    }
    return map;
}

const physToWiring = {
    "3": 8,
    "5": 9,
    "7": 7,
    "8": 15,
    "10": 16,
    "11": 0,
    "12": 1,
    "13": 2,
    "15": 3,
    "16": 4,
    "18": 5,
    "19": 12,
    "21": 13,
    "22": 6,
    "23": 14,
    "24": 10,
    "26": 11,
    "29": 21,
    "31": 22,
    "32": 26,
    "33": 23,
    "35": 24,
    "36": 27,
    "37": 25,
    "38": 28,
    "40": 29
}

module.exports.physToBcm = physToBcm;
module.exports.physToWiring = physToWiring;
