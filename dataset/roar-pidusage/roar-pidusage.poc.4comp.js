
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 1000; i++){
        try{
               var roar_pidusage = require('roar-pidusage');
           roar_pidusage.stat('$(touch success)', function(){});
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       var roar_pidusage = require('roar-pidusage');
   roar_pidusage.stat('$(touch success)', function(){});

    }
