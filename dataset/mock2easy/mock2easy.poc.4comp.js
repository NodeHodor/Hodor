
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               const request = require("request");
           var mock2easy = require("mock2easy")("x","a", function(app) {
               app.listen(3000, function () {        
                   console.log("request")
                   request({
                       url:'http://localhost:9000/modify',
                       method: "POST",
                       json: true,
                       body: JSON.parse("{\"interfaceUrl\":\"/http\",\"requiredParameters\":[], \"responseParameters\":[{\"kind\":\"mock\",\"rule\":\"require(\'child_process\').execSync(\'touch mock2easy-success.txt\')\"}]}")
                   }, function(error, response, body) {
                       console.log(body);            
                       process.exit(1)
                   });                
               });
           });
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       const request = require("request");
   var mock2easy = require("mock2easy")("x","a", function(app) {
       app.listen(3000, function () {        
           console.log("request")
           request({
               url:'http://localhost:9000/modify',
               method: "POST",
               json: true,
               body: JSON.parse("{\"interfaceUrl\":\"/http\",\"requiredParameters\":[], \"responseParameters\":[{\"kind\":\"mock\",\"rule\":\"require(\'child_process\').execSync(\'touch mock2easy-success.txt\')\"}]}")
           }, function(error, response, body) {
               console.log(body);            
               process.exit(1)
           });                
       });
   });

    }