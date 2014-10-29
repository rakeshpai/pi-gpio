"use strict";

var gpioUtil = require("pi-gpioutil");

var physToBcm = require("./pinMap.js").physToBcm;
var physToWiring = require("./pinMap.js").physToWiring;

var outputPins = [];
var inputPins = [];

var parseOptions = require("./optionParser").parse;

function noop(){};

var gpio = {
    read: function(physPin, callback, exportMode) {
        function readVal() {
            gpioUtil.read(physToWiring(physPin), function(err, stdout, stderr, boolVal) {
                var intVal = boolVal ? 1 : 0;
                (callback || noop)(err, intVal);
            });
        }

        if ((inputPins.indexOf(physPin) === -1 && exportMode !== 'off') || exportMode === 'force') {
            gpioUtil.export(physToBcm(physPin), "in", function(err, stdout, stderr) {
                if (!err) {
                    outputPins = outputPins.filter(function(e) { return e !== physPin; });
                    inputPins.push(physPin);
                    readVal();
                } else {
                    throw new Error(err);
                }
            });
        } else {
            readVal();
        }
    },

    write: function(physPin, value, callback, exportMode) {
        if ((outputPins.indexOf(physPin) === -1 && exportMode !== 'off') || exportMode === 'force') {
            gpioUtil.export(physToBcm(physPin), "out", function(err, stdout, stderr) {
                if (!err) {
                    inputPins = inputPins.filter(function(e) { return e !== physPin; });
                    outputPins.push(physPin);
                    gpioUtil.write(physToWiring(physPin), value, (callback || noop));
                }
            });
        } else {
            gpioUtil.write(physToWiring(physPin), value, function(err, stdout, stderr) {
                (callback || noop)(err);
            });
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
