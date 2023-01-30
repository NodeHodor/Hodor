var Class = require('pixl-class');

var Sleeper = Class.create({
    
    // promisify all methods
    __promisify: true,
    
    sleep: function(ms, callback) {
        // sleep for N milliseconds, then fire callback
        setTimeout( function() { callback(false); }, ms );
    }
    
});

var snooze = new Sleeper();
 
async function main() {
    await snooze.sleep( 1000 ); // waits for 1 second here
    console.log("This happened 1 second later!");
};
 
main();
