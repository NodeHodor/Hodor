
    var arguments = process.argv;
    if (arguments.length == 3) {
        type = arguments[2];
        var time1 = process.hrtime.bigint();
        for (var i = 0; i < 100000; i++){
        try{
               var resize = require('mobile-icon-resizer');
           
           var options = 
             {android: {
                   "images" : [
                           {
                                     "baseRatio" : console.log('hacked'),
           
                                     "folder" : "drawable-mdpi"
                                   },
                  {
                          "baseRatio" : "4",
                                  "folder" : "drawable-xxxhdpi"
                                        },
                                              {
                                                      "size": "512x512",
                                                              "folder" : "WEB"
                                                                    }
                                                                        ]
                                                                          }
             }
           
           
           
           resize(options, function (err) {
           
           
           });
 } catch(e){}
        }      
        var time2 = process.hrtime.bigint();
        console.log(`${type}_time: ${time2-time1}`); 
        require("fs").writeFileSync(`${type}_time`, (time2-time1).toString()); 
    } else{
       var resize = require('mobile-icon-resizer');
   
   var options = 
     {android: {
           "images" : [
                   {
                             "baseRatio" : console.log('hacked'),
   
                             "folder" : "drawable-mdpi"
                           },
          {
                  "baseRatio" : "4",
                          "folder" : "drawable-xxxhdpi"
                                },
                                      {
                                              "size": "512x512",
                                                      "folder" : "WEB"
                                                            }
                                                                ]
                                                                  }
     }
   
   
   
   resize(options, function (err) {
   
   
   });

    }