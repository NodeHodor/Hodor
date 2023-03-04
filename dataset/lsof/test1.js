var lsof = require('lsof');

// What is running on port 11211?
lsof.rawTcpPort(8001, function(data) {
    console.log(data);
});

lsof.rawUdpPort(8001, function(data) {
    console.log(data);
});


lsof.raw(function(data) {
    console.log(data);
});

lsof.counters(function(data) {
    console.log(data);
});

