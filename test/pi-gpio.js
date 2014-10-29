var gpio = require("../pi-gpio"),
    should = require("should"),
    fs = require("fs");

var testPin = 16;
var testPinSysPath = "/sys/devices/virtual/gpio/gpio23";
var invalidPin = 1;

function verifyByFsRead(file, expectedContent, done) {
    fs.readFile(testPinSysPath + "/" + file, "utf8", function(err, data) {
        should.not.exist(err);
        data.trim().should.equal(expectedContent);
        done();
    });
}

function verifyDirection(direction, done) {
    verifyByFsRead("direction", direction, done);
}

function verifyValue(value, done) {
    verifyByFsRead("value", value, done);
}

describe("pi-gpio", function() {
    describe("hooks", function() {
        before("close pin", function(done) {
            gpio.close(testPin, done);
        });

        describe(".open", function() {
            it("should open without errors", function(done) {
                gpio.open(testPin, function(err) {
                    should.not.exist(err);
                    done();
                });
            });
    
            it("should throw an error if the pin is invalid", function() {
                try {
                    gpio.open(invalidPin);
                } catch(e) {
                    e.should.exist;
                }
            });
    
            it("should set the direction to output by default", verifyDirection.bind(this, "out"));
        });
    });

    describe("hooks", function() {
        before("open pin", function(done) {
            gpio.open(testPin, done);
        });

        describe(".close", function() {
            it("should close an open pin", function(done) {
                gpio.close(testPin, done); // TODO actually test for success
            });
        });
    });

    describe(".setDirection", function() {
        ["in", "out"].forEach(function(direction) {
            it("should set the direction of the pin: " + direction, function(done) {
                gpio.open(testPin, direction, function(err) {
                    should.not.exist(err);
                    verifyDirection(direction, done);
                });
            });
        });
    });

    ["in", "out"].forEach(function(testDirection) {
        describe("hooks", function() {
            before("open pin as: " + testDirection, function(done) {
                gpio.open(testPin, testDirection, done);
            });

            describe(".getDirection", function() {
                it("should get the direction of the pin: " + testDirection, function(done) {
                    gpio.getDirection(testPin, function(err, direction) {
                        should.not.exist(err);
                        direction.should.equal(testDirection);
                        done();
                    });
                });
            });
        });
    });

    describe(".write", function() {
        ["1", "0"].forEach(function(testValue) {
            it("should write the value of the pin: " + testValue, function(done) {
                gpio.open(testPin, "output", function(err) {
                    should.not.exist(err);
                    gpio.write(testPin, testValue, function(err) {
                        should.not.exist(err);
                        verifyValue(testValue, done);
                    });
                });
            });
    
            it("should auto-export and write if pin closed: " + testValue, function(done) {
                gpio.close(testPin, function(err) { /* sic! */
                    should.not.exist(err);
                    gpio.write(testPin, testValue, function(err) {
                        should.not.exist(err);
                        verifyValue(testValue, done);
                    });
                });
            });
        });
    });

    ["0", "1"].forEach(function(testValue) {
        describe("hooks", function() {
            before("set pin to: " + testValue, function(done) {
                gpio.write(testPin, testValue, done, true); // force-export
            });

            describe(".read", function() {
                it("should read the value at the pin correctly: " + testValue, function(done) {
                    gpio.read(testPin, function(err, value) {
                        should.not.exist(err);
                        value.should.equal(parseInt(testValue));
                        done();
                    }, 'off');
                });
            });
        });
    });

    after(function(done) {
        gpio.close(testPin, done);
    });
});
