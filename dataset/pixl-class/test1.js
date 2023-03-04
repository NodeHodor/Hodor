var Class = require('pixl-class');

var Animal = Class.create({
    
    // class member variables
    nickname: '',
    color: '',
    
    // class constructor
    __construct: function(new_name, new_color) {
        this.nickname = new_name;
        this.color = new_color;
    },
    
    // methods
    getInfo: function() {
        return("Nickname: " + this.nickname + "\nColor: " + this.color);
    }
    
});

var dog = new Animal('Spot', 'Green');
console.log( dog.getInfo() );

dog.nickname = 'Skippy';
dog.color = 'Blue';
console.log( dog.getInfo() );

var Bear = Class.create({
    
    // inherit from Animal
    __parent: Animal,
    
    // define a new member variable
    wants: 'Honey',
    
    // and a new method
    roar: function() {
        console.log("Roar!  Give me " + this.wants + "!");
    }
    
});

var grizzly = new Bear('Fred', 'Brown');
console.log( grizzly.getInfo() );
 
grizzly.wants = 'blood';
grizzly.roar();

var Bear = Class.create({
    __parent: Animal,
    wants: 'Honey',
    roar: function() { console.log("Roar!  Give me " + this.wants + "!"); },
    
    // override base class method
    getInfo: function() {
        // first, get info from base class
        var info = Animal.prototype.getInfo.call(this);
        
        // append bear info and return combined info
        info += "\nWants: " + this.wants;
        return info;
    }
    
});

var Bear = Class.create({
    
    __parent: Animal,
    wants: 'Honey',
    
    // override base class constructor
    __construct: function(new_name, new_color, new_wants) {
        // invoke superclass constructor to set name and color
        Animal.call(this, new_name, new_color);
        this.wants = new_wants;
    },
    
    // and a new method
    roar: function() {
        alert("Roar!  Give me " + this.wants + "!");
    }
    
});


var Beer = Class.create({
    
    // static members
    __static: {
        types: ['Lager', 'Ale', 'Stout', 'Barleywine']
    },
    
    // class member variables
    nickname: '',
    type: '',
    
    // class constructor
    __construct: function(new_name, new_type) {
        this.nickname = new_name;
        
        if (!Beer.types.indexOf(new_type) == -1) throw("Type not known: " + new_type);
        this.type = new_type;
    },
    
    // methods
    getInfo: function() {
        return("Nickname: " + this.nickname + "\nType: " + this.type);
    }
    
});

var Liquid = Class.create({
    flavor: "sweet"
});
 
var Glass = Class.create({
    size: 8
});
 
var Soda = Class.create({
    
    __mixins: ['Liquid', 'Glass'],
    
    drink: function() {
        console.log("Yum, " + this.size + " oz of " + this.flavor + " drink!");
    }
    
});

var Party = Class.create({
    
    start: function() {
        console.log("Let's get this party started!");
        this.emit('dance');
    }
    
});
 
var birthday = new Party();
birthday.on('dance', function() {
    console("I'm dancing!");
} );
birthday.start();

var Party = Class.create({
    
    // do not inherit from EventEmitter
    __events: false,
    
    start: function() {
        console.log("Let's get this party started!");
    }
    
});

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



