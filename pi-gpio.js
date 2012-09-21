"use strict";
var fs = require("fs"),
	path = require("path"),
	exec = require("child_process").exec;

var gpioAdmin = "gpio-admin",
	sysFsPath = "/sys/devices/virtual/gpio";

var pinMapping = {
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
	"26": 7
};

function isNumber(number) {
	return !isNaN(parseInt(number, 10));
}

function noop(){}

function handleExecResponse(method, pinNumber, callback) {
	return function(err, stdout, stderr) {
		if(err) {
			console.error("Error when trying to", method, "pin", pinNumber);
			console.error(stderr);
			callback(err);
		} else {
			callback();
		}
	}
}

function sanitizePinNumber(pinNumber) {
	if(!isNumber(pinNumber) || !isNumber(pinMapping[pinNumber])) {
		throw new Error("Pin number isn't valid");
	}

	return parseInt(pinNumber, 10);
}

function sanitizeDirection(direction) {
	direction = (direction || "").toLowerCase().trim();
	if(direction === "in" || direction === "input") {
		return "in";
	} else if(direction === "out" || direction === "output" || !direction) {
		return "out";
	} else {
		throw new Error("Direction must be 'input' or 'output'");
	}
}

var gpio = {
	open: function(pinNumber, direction, callback) {
		pinNumber = sanitizePinNumber(pinNumber);

		if(!callback && typeof direction === "function") {
			callback = direction;
			direction = "out";
		}

		direction = sanitizeDirection(direction);

		exec(gpioAdmin + " export " + pinMapping[pinNumber], handleExecResponse("open", pinNumber, function(err) {
			if(err) return (callback || noop)(err);

			gpio.setDirection(pinNumber, direction, callback);
		}));
	},

	setDirection: function(pinNumber, direction, callback) {
		pinNumber = sanitizePinNumber(pinNumber);
		direction = sanitizeDirection(direction);

		fs.writeFile(sysFsPath + "/gpio" + pinMapping[pinNumber] + "/direction", direction, callback);
	},

	getDirection: function(pinNumber, callback) {
		pinNumber = sanitizePinNumber(pinNumber);

		fs.readFile(sysFsPath + "/gpio" + pinMapping[pinNumber] + "/direction", "utf8", function(err, direction) {
			if(err) return callback(err);
			callback(null, sanitizeDirection(direction.trim()));
		});
	},

	close: function(pinNumber, callback) {
		pinNumber = sanitizePinNumber(pinNumber);

		exec(gpioAdmin + " unexport " + pinMapping[pinNumber], handleExecResponse("close", pinNumber, callback || noop));
	},

	read: function(pinNumber, callback) {
		pinNumber = sanitizePinNumber(pinNumber);

		fs.readFile(sysFsPath + "/gpio" + pinMapping[pinNumber] + "/value", function(err, data) {
			if(err) return (callback || noop)(err);

			(callback || noop)(null, parseInt(data, 10));
		});
	},

	write: function(pinNumber, value, callback) {
		pinNumber = sanitizePinNumber(pinNumber);

		value = !!value?"1":"0";

		fs.writeFile(sysFsPath + "/gpio" + pinMapping[pinNumber] + "/value", value, "utf8", callback);
	}
};

gpio.export = gpio.open;
gpio.unexport = gpio.close;

module.exports = gpio;
