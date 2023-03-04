var macaddress = require('macaddress');

macaddress.one('awdl0', function (err, mac) {
  console.log("Mac address for awdl0: %s", mac);  
});

macaddress.one(function (err, mac) {
  console.log("Mac address for this host: %s", mac);  
});

macaddress.all(function (err, all) {
  console.log(JSON.stringify(all, null, 2));
});

console.log(JSON.stringify(macaddress.networkInterfaces(), null, 2));
