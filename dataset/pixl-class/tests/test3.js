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
    }
    
    // and a new method
    roar: function() {
        alert("Roar!  Give me " + this.wants + "!");
    }
    
});
