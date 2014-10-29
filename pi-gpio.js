"use strict";

var fs = require("fs");
var gpioUtil = require("pi-gpioutil");

var physToBcm = require("./pinMap.js").physToBcm;
var physToWiring = require("./pinMap.js").physToWiring;

var outputPins = [];
var inputPins = [];

var parseOptions = require("./optionParser").parse;

var sysFsPath = "/sys/devices/virtual/gpio";

function noop(){};

var gpio = {
    read: function(physPin, callback, exportMode) {
        function readVal(err) {
            if (err) {
                (callback || noop)(err);
            } else {
                fs.readFile(sysFsPath + "/gpio" + physToBcm(physPin) + "/value", "utf8", function(err, val) {
                    if (err) return (callback || noop)(err);
                    (callback || noop)(null, parseInt(val.trim(), 10));
                });
            }
        }

        if ((inputPins.indexOf(physPin) === -1 && exportMode !== 'off') || exportMode === 'force') {
            this.export(physPin, "in", readVal);
        } else {
            readVal();
        }
    },

    write: function(physPin, value, callback, exportMode) {
        function writeVal(err) {
            if (err) {
                (callback || noop)(err);
            } else {
                fs.writeFile(sysFsPath + "/gpio" + physToBcm(physPin) + "/value", value, "utf8", (callback || noop));
            }
        }

        if ((outputPins.indexOf(physPin) === -1 && exportMode !== 'off') || exportMode === 'force') {
            this.export(physPin, "out", writeVal);
        } else {
            writeVal();
        }
    },

    export: function(physPin, optionsString, callback) {
        // allow option parameter to be omitted
        if (typeof optionsString === 'function') {
            callback = optionsString;
            optionsString = '';
        }

        var options = parseOptions(optionsString);

        gpioUtil.export(physToBcm(physPin), options.direction, function(err, stdout, stderr) {
            if (err) {
                console.error("ERROR [pi-gpio] failed to export pin " + physPin);
            }
            if (options.direction === 'in') {
                inputPins.push(physPin);
            } else if (options.direction === 'out') {
                outputPins.push(physPin);
            }

            if (typeof options.pull !== 'undefined') {
                gpioUtil.mode(physToWiring(physPin), options.pull, (callback || noop));
            } else {
                (callback || noop)(err);
            }
        });
    },

    unexport: function(physPin, callback) {
        gpioUtil.unexport(physToBcm(physPin), function(err, stdout, stderr) {
            if (err) {
                console.error("ERROR [pi-gpio] failed to unexport pin " + physPin);
            }
            inputPins = inputPins.filter(function(e) { return e !== physPin; });
            outputPins = outputPins.filter(function(e) { return e !== physPin; });
            (callback || noop)(err);
        });
    },

    getMode: function(physPin, callback) {
        gpioUtil.readall(function(err, stdout, stderr, pins) {
            var relevantPin = pins.filter(function(pin) {
                return pin.phys === physPin;
            })[0];
            (callback || noop)(err, relevantPin.mode);
        });
    }
};

// aliases
gpio.open         = gpio.export;
gpio.setDirection = gpio.export;
gpio.close        = gpio.unexport;

// note that mode is not quite the same as direction
// mode can not only be 'in' or 'out', but also e.g. 'alt0'
gpio.getDirection = gpio.getMode;

module.exports = gpio;
