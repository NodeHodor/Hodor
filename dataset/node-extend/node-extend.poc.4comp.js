
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               var extend = require("node-extend");
           foo = extend("function (){}); //(){console.log(123)}","")
           console.log(foo);
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       var extend = require("node-extend");
   foo = extend("function (){});console.log(234); //(){console.log(123)}","")
   console.log(foo);

    }
