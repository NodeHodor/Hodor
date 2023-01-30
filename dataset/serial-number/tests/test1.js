var serialNumber = require('serial-number');
 
serialNumber(function (err, value) {
    console.log(value);
});

serialNumber.preferUUID = true;

serialNumber.useSudo(function (err, value) {
	console.log(value);
});
