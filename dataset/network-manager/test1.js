var manager = require('network-manager');
console.log(manager.getDevices());
manager.getWifiNetworkAvailable('veth85d7f0f');
manager.getConnection();