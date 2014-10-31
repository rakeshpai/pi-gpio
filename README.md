pi-gpio
=======

pi-gpio is a simple node.js based library to help access the GPIO of the Raspberry Pi (Debian Wheezy). It's modelled loosely around the built-in ``fs`` module. Works with the original Raspberry Pi (A and B), the model B revision 2 boards, and the Raspberry Pi Model B+.

After the [installation](#installation), reading and writing is as easy as this:
```javascript
var gpio = require("pi-gpio");

gpio.write(16, 1, function() {
    console.log("Physical pin no. 16 set to high.");
});

gpio.read(11, function(err, value) {
    if (!err) {
        console.log("Pin 11 is reading " + (value === 1 ? "high" : "low"));
    }
});
```
See the [usage reference](#usage) below for more information.

## How you can help

Ways you can help:

    - Review the pull requests and test them on a Pi for correctness.
    - Report Bugs.
    - Fix a bug or add something awesome, Send a pull request.

## About the pin configuration

This couldn't have been more confusing. Raspberry Pi's physical pins are not laid out in any particular logical order. Most of them are given the names of the pins of the Broadcom chip it uses (BCM2835). There isn't even a logical relationship between the physical layout of the Raspberry Pi pin header and the Broadcom chip's pinout. The OS recognizes the names of the Broadcom chip and has nothing to do with the physical pin layout on the Pi. To add to the fun, the specs for the Broadcom chip are nearly impossible to get!

This library simplifies all of this (hopefully), by abstracting away the Broadcom chip details. You only need to refer to the pins as they are on the physical pin layout on the Raspberry PI. For your reference, the pin layout follows. All the pins marked "GPIO" can be used with this library, using pin numbers as below.

<table>
	<tr>
		<td>
			P1 - 3.3v
		</td>
		<td>
			1
		</td>
		<td>
			2
		</td>
		<td>
			5v
		</td>
	</tr>
	<tr>
		<td>
			I2C SDA
		</td>
		<td>
			3
		</td>
		<td >
			4
		</td>
		<td>
			--
		</td>
	</tr>
	<tr>
		<td>
			I2C SCL
		</td>
		<td>
			5
		</td>
		<td>
			6
		</td>
		<td>
			Ground
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			7
		</td>
		<td>
			8
		</td>
		<td>
			TX
		</td>
	</tr>
	<tr>
		<td>
			--
		</td>
		<td>
			9
		</td>
		<td>
			10
		</td>
		<td>
			RX
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			11
		</td>
		<td>
			12
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			13
		</td>
		<td>
			14
		</td>
		<td>
			--
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			15
		</td>
		<td>
			16
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			--
		</td>
		<td>
			17
		</td>
		<td>
			18
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			SPI MOSI
		</td>
		<td>
			19
		</td>
		<td>
			20
		</td>
		<td>
			--
		</td>
	</tr>
	<tr>
		<td>
			SPI MISO
		</td>
		<td>
			21
		</td>
		<td>
			22
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			SPI SCLK
		</td>
		<td>
			23
		</td>
		<td>
			24
		</td>
		<td>
			SPI CE0
		</td>
	</tr>
	<tr>
		<td>
			--
		</td>
		<td>
			25
		</td>
		<td>
			26
		</td>
		<td>
			SPI CE1
		</td>
	</tr>
	<tr>
		<td colspan="4">Model B+ pins</td>
	</tr>
	<tr>
		<td>
			ID_SD
		</td>
		<td>
			27
		</td>
		<td>
			28
		</td>
		<td>
			ID_SC
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			29
		</td>
		<td>
			30
		</td>
		<td>
			--
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			31
		</td>
		<td>
			32
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			33
		</td>
		<td>
			34
		</td>
		<td>
			--
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			35
		</td>
		<td>
			36
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			GPIO
		</td>
		<td>
			37
		</td>
		<td>
			38
		</td>
		<td>
			GPIO
		</td>
	</tr>
	<tr>
		<td>
			--
		</td>
		<td>
			39
		</td>
		<td>
			40
		</td>
		<td>
			GPIO
		</td>
	</tr>
</table>

That gives you several GPIO pins to play with: pins 7, 11, 12, 13, 15, 16, 18 and 22 (with the B+ giving 29, 31, 32, 33, 35, 37, 38 and 40). You should provide these physical pin numbers to this library, and not bother with what they are called internally. Easy-peasy.

## Installation

If you haven't already, get node and npm on the Pi. The simplest way is:

	sudo apt-get install nodejs npm

The Raspberry Pi's GPIO pins require you to be root to access them. That's totally unsafe for several reasons. To get around this problem, you should use the excellent [Wiring Pi GPIO utility](http://wiringpi.com/the-gpio-utility/).

Install Wiring Pi (which includes the tool) [as described on their website](http://wiringpi.com/download-and-install/):

    git clone git://git.drogon.net/wiringPi
	cd wiringPi
    ./build

Next, ``cd`` to your project directory and use npm to install pi-gpio in your project.

	npm install pi-gpio

That's it!

## Usage

### .read(pinNumber, [callback], [exportMode])

Reads the current value of the pin.

* `pinNumber`: As usual.
* `callback`: Will receive a possible error object as the first argument, and the value of the pin as the second argument. The value will be either `0` or `1` (numeric).
* `exportMode` (optional): May be omitted, `'off'`, or `'force'`.  
  If omitted, the pin will be exported as input before reading unless its last known state is input.  
  If `'off'`, the pin will be neither exported nor its direction adjusted; leaving those tasks to you. (This matches the old pre-`v0.1.0` behaviour.)  
  If `'force'`, the pin will be exported as input, even if that's its last known state.

Example:
```javascript
gpio.read(16, function(err, value) {
	if(err) throw err;
	console.log(value);	// The current state of the pin
});
```

### .write(pinNumber, value, [callback], [exportMode])

Writes `value` to `pinNumber`.

* `pinNumber`: As usual.
* `value`: Must be either `0` or `1`, or equivalently `false` or `true`.
* `callback` (optional): Will be called when the value is set. Again, might receive an error.
* `exportMode` (optional): May be omitted, `'off'`, or `'force'`.  
  If omitted, the pin will be exported as output before writing unless its last known state is output.  
  If `'off'`, the pin will be neither exported nor its direction adjusted; leaving those tasks to you. (This matches the old pre-`v0.1.0` behaviour.)  
  If `'force'`, the pin will be exported as output, even if that's its last known state.

Example:
```js
gpio.write(16, 1, function(err) {
    if(err) throw err;
    console.log("Pin 16 set to HIGH.");
});
```

### .export(pinNumber, [options], [callback])

Aliased to `.open`

Uses the [GPIO utility](http://wiringpi.com/the-gpio-utility/) to *export* the pin via the `/sys/class/gpio` interface. By default, `.write` and `.read` will automatically export the pin as output/input respectively (see their `exportMode` parameter), so you should not *need* to call this – but it doesn't hurt, if you want to be explicit.
Note: Starting with `v0.1.0`, exporting a pin that's already exported does no harm.

* `pinNumber`: The pin number to make available. Remember, `pinNumber` is the physical pin number on the Pi.
* `options` (optional): Must be a string of options separated by a space, such as `input` or `input pullup`.  
  You can specify whether the pin direction should be `input` (equivalently `in`) or `output` (`out`).  
  You can additionally set the internal pullup / pulldown resistor by sepcifying `pullup` (`up`), `pulldown` (`down`), or `tri` (neither pullup not pulldown).  
  If no direction is given, it defaults to `output`.  
  If no resistor setting is given, it will not be changed.  
* `callback` (optional): Will be called when the pin is available for use. May receive an error as the first argument if something went wrong.

Example:
```js
// export as input, engage internal pullup
gpio.export(16, 'in pullup', function(err) {
    // and read value
    if (!err) gpio.read(16, function(err, value) {
        if (!err) console.log(value);
    });
});
```
### .unexport(pinNumber, [callback])

Aliased to `.close`

*Unexports* pin, that is, removes it from the `/sys/class/gpio` interface.
You may unexport the pins you exported if you want to leave your Pi exactly like you found it, but if you just leave them open, there's no harm in that either.

* `pinNumber`: The pin number to close. Again, `pinNumber` is the physical pin number on the Pi.
* `callback` (optional): Will be called when the pin is closed. Again, may receive an error as the first argument.

### .setDirection(pinNumber, direction, [callback])

Changes the direction from `input` to `output` or vice-versa.
Note: By default, `read` and `write` will automatically change the direction to `input`/`output` respectively.

* `pinNumber`: As usual.
* `direction`: Either `input` (or `in`) or `output` (`out`).
* `callback`: Will be called when direction change is complete. May receive an error as usual.

### .getDirection(pinNumber, [callback])

Gets the direction of the pin. Acts like a getter for the method above.

* `pinNumber`: As usual.
* `callback`: Will be called when the direction is received. The first argument could be an error. The second argument will either be `'in'` or `'out'`.

## Misc

* To run tests: ``npm install && npm test`` where you've got the checkout.
* This module was created, ``git push``'ed and ``npm publish``'ed all from the Raspberry Pi! The Pi rocks!

## Coming soon

* Support for I2C and SPI (though it should already be possible to bit-bang the SPI protocol).
* Any other suggestions?

## License

(The MIT License)

Copyright (c) 2012–2014 Rakesh Pai <rakeshpai@gmail.com> and contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
