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
