var pusage = require('roar-pidusage')
 
pusage.stat(process.pid, function(err, stat) {
 
})
 
// Unmonitor process
pusage.unmonitor(process.pid);

