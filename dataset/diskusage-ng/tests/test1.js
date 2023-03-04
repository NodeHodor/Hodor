var diskusage = require('diskusage-ng');

diskusage('/home/nodejs', function(err, usage) {
	if (err) return console.log(err);

	console.log(usage.total);
	console.log(usage.used);
	console.log(usage.available);
});

