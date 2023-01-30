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
