var macfromip = require('macfromip');

macfromip.getMac('192.168.2.57', function(err, data){
	if(err){
		console.log(err);
	}
	else{
    	console.log(data);
    }
});


macfromip.isEmpty('')
macfromip.isEmpty(null)
macfromip.isEmpty()

macfromip.isString('1233536')
macfromip.isString('#$%&asda3445')

macfromip.isIpAddress('127.0.0.1')
macfromip.isIpAddress('255.255.255.255')
macfromip.isIpAddress('0.0.0.0')

macfromip.ipIsSelf('255.255.255.255')