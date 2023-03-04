var monitor = require("pomelo-monitor");

var param = {
	pid: process.pid,
	serverId: 'node-1'
};

monitor.psmonitor.getPsInfo(param, function(err, data) {
	console.log('process information is :', data);
});

monitor.sysmonitor.getSysInfo(function(err, data) {
	console.log('operating-system information is :', data);
});
