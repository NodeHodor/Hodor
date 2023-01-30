var Class = require('pixl-class');

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
