var macfromip = require('macfromip');

macfromip.getMac('192.168.2.169', function(err, data){
    if(err){
    	console.log(err);
    }
    console.log(data);
});
