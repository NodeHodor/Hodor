
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 1000; i++){
        try{
               var Sandbox = require("sandbox")
           s = new Sandbox()
           code = `new Function("return (this.constructor.constructor('return (this.process.mainModule.constructor._load)')())")()("util").inspect("hi")`
           s.run(code)
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       var Sandbox = require("sandbox")
   s = new Sandbox()
   code = `new Function("return (this.constructor.constructor('return (this.process.mainModule.constructor._load)')())")()("util").inspect("hi")`
   s.run(code)

    }