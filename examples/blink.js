var gpio = require("../pi-gpio");

// using relative import here for demo purposes
// in your own projects, you should `npm install pi-gpio` and use:
// var gpio = require("pi-gpio");

var value = 1;
    
setInterval(function() {
    gpio.write(16, value, function() {
        value = (value === 1 ? 0 : 1);
    });
}, 1000);
