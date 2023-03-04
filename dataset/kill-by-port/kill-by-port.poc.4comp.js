
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               var kill_by_port = require('kill-by-port');
           // kill_by_port.killByPort('$(echo 123 > tmp)');
           kill_by_port.killByPort();
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       var kill_by_port = require('kill-by-port');
   // kill_by_port.killByPort('$(echo 123 > tmp)');
   kill_by_port.killByPort();

    }