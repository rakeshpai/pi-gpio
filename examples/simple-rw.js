var gpio = require("../pi-gpio");

// using relative import here for demo purposes
// in your own projects, you should `npm install pi-gpio` and use:
// var gpio = require("pi-gpio");

gpio.write(16, 1, function() {
    console.log("Physical pin no. 16 set to high.");
});

// note that by default, the internal pullup/down resistors are off
gpio.read(11, function(err, value) {
    if (!err) {
        console.log("Pin 11 is reading" + (value === 1 ? "high" : "low"));
    }
});
