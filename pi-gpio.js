"use strict";

var fs             = require("fs");
var gpioUtil       = require("pi-gpioutil");
var revision       = require("./piRevision");
var physToBcm      = require("./pinMap").physToBcm;
var physToWiring   = require("./pinMap").physToWiring;
var parseOptions   = require("./paramParser").parseOptions;
var parseValue     = require("./paramParser").parseValue;
var parseDirection = require("./paramParser").parseDirection;

var outputPins = [];
var inputPins = [];

var sysFsPath = "/sys/devices/virtual/gpio";

function noop(){};

var gpio = {
    rev: revision,

    read: function(physPin, callback, exportMode) {
        if (typeof callback === 'string') {
            exportMode = callback;
            callback = null;
        }

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
        if (typeof callback === 'string') {
            exportMode = callback;
            callback = null;
        }

        function writeVal(err) {
            if (err) {
                (callback || noop)(err);
            } else {
                fs.writeFile(sysFsPath + "/gpio" + physToBcm(physPin) + "/value", parseValue(value), "utf8", (callback || noop));
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

    getDirection: function(physPin, callback) {
        fs.readFile(sysFsPath + "/gpio" + physToBcm(physPin) + "/direction", "utf8", function(err, direction) {
            if (err) return (callback || noop)(err);
            (callback || noop)(null, direction.trim());
        });
    },

    setDirection: function(physPin, direction, callback) {
        direction = parseDirection(direction);
        fs.writeFile(sysFsPath + "/gpio" + physToBcm(physPin) + "/direction", direction, (callback || noop));
    }
};

// aliases
gpio.open  = gpio.export;
gpio.close = gpio.unexport;

module.exports = gpio;
