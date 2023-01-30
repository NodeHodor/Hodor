var RPI = require("rpi");
var pin8 = new RPI.GPIO(8, 'in');
pin8.on('ready', function() {
 console.log('ready');
});
pin8.on('rise', function() {
 console.log('rise');
});
pin8.on('change', function(value) {
 console.log(value);
});
