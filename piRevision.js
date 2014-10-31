var fs = require('fs');

// http://elinux.org/RPi_HardwareHistory#Board_Revision_History
var rev = parseInt(fs.readFileSync("/proc/cpuinfo").toString().split("\n").filter(function(line) {
              return line.indexOf("Revision") == 0;
          })[0].split(":")[1].trim(), 16) < 3 ? 1 : 2;

module.exports = rev;
