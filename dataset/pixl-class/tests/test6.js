var Class = require('pixl-class');

var Party = Class.create({
    
    start: function() {
        console.log("Let's get this party started!");
        this.emit('dance');
    }
    
});
 
var birthday = new Party();
birthday.on('dance', function() {
    console.log("I'm dancing!");
} );
birthday.start();

var Party = Class.create({
    
    // do not inherit from EventEmitter
    __events: false,
    
    start: function() {
        console.log("Let's get this party started!");
    }
    
});
