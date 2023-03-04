
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               const sea = require("./node_modules/modjs/lib/utils/sea");
           // sea.findSeajsConfig();
           sea.findSeajsConfig("seajs.config({a: require('fs').writeFileSync('./modjs-success.txt', '23')})");
           
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       const sea = require("./node_modules/modjs/lib/utils/sea");
   // sea.findSeajsConfig();
   sea.findSeajsConfig("seajs.config({a: require('fs').writeFileSync('./modjs-success.txt', '23')})");
   

    }