var macaddress = require('macaddress');

var sync = macaddress.one(function (err, mac) {
  if (err || !/[a-f0-9]{2}(:[a-f0-9]{2}){5}/.test(mac)) {
    throw err || mac;
  }
  console.log("Mac address for this host: %s", mac);  
});

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
