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
