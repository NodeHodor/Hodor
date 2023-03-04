
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               const {VM} = require('vm2');
           const untrusted = '(' + function(){
           	const bad = new Error();
           	bad.__proto__ = null;
           	bad.stack = {
           			startsWith(){
           				return true;
           			},
           			length: 5,
           			match(outer){
           				throw outer.constructor.constructor("return process")().env;
           			}
           	};
           	return bad;
           }+')()';
           try{
           	console.log(new VM().run(untrusted));
           }catch(x){
           	console.log(x);
           }
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       const {VM} = require('vm2');
   const untrusted = '(' + function(){
   	const bad = new Error();
   	bad.__proto__ = null;
   	bad.stack = {
   			startsWith(){
   				return true;
   			},
   			length: 5,
   			match(outer){
   				throw outer.constructor.constructor("return process")().env;
   			}
   	};
   	return bad;
   }+')()';
   try{
   	console.log(new VM().run(untrusted));
   }catch(x){
   	console.log(x);
   }

    }