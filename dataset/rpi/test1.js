var RPI = require("rpi");
var pin8 = new RPI.GPIO(8, 'in');
pin8.on('ready', function() {
    gpio.write(1, writeSpy);
});

var GPIO = require("rpi").GPIO;
gpio = new GPIO(8, 'in');
gpio.on('ready', function() {
    var fn = function() {
        gpio.write(1);
    };
});

gpio = new GPIO(8, 'out');
gpio.on('ready', function() {
    gpio.high();
});
// invoke proc.exec callback from the constructor
// proc.exec.invokeCallback();
// invoke the gpio.high callback
// proc.exec.invokeCallback();


gpio = new GPIO(8, 'out');
gpio.on('ready', function() {
    gpio.low();
});
// invoke proc.exec callback from the constructor
// proc.exec.invokeCallback();
// invoke the gpio.low callback
// proc.exec.invokeCallback();

gpio = new GPIO(8, 'out');
gpio.on('ready', function() {
    gpio.write(1, function() {
        gpio.read();
    });
});
// invoke proc.exec callback from the constructor
// proc.exec.invokeCallback();
// invoke the gpio.write callback
// proc.exec.invokeCallback();

var pin8 = new RPI.GPIO(8, 'out');
pin8.on('rise', function() {
 console.log('rise');
});
pin8.on('change', function(value) {
 console.log(value);
});
pin8.read(()=>{});
try {
    pin8.write(1, ()=>{});
} catch{

}

try {
    pin8.low(1, ()=>{});
} catch{
    
}

try {
    pin8.high(1, ()=>{});
} catch{
    
}
