const Arpping = require('arpping');
var arpping = new Arpping(options);

Arpping.getNetworkInterfaces();

var arpping = new Arpping({
  onConnect: [ connection => console.log(`Connected: ${JSON.stringify(connection, null, 4)}`) ]
});

var connection = arpping.getConnection({
  interface: [ 'en0' ],
  internal: [ false ],
  family: []
});

arpping.discover()
  .then(hosts => console.log(JSON.stringify(hosts, null, 4)))
  .catch(err => console.log(err));

var ipArray = [
  "192.168.0.3",
  "192.168.0.12",
  "192.168.0.24"
];
arpping.searchByIpAddress(ipArray)
  .then(({ hosts, missing }) => {
    console.log(`${hosts.length} host(s) found:\n${JSON.stringify(hosts, null, 4)}`);
    console.log(`${missing.length} host(s) missing:\n${missing}`);
  })
  .catch(err => console.log(err));


var macArray = [
  "01:01:01",
  "01:01:01:99:99:99",
  "7f:54:12"
];
arpping.searchByMacAddress(macArray)
  .then(({ hosts, missing }) => {
    console.log(`${hosts.length} matching host(s) found:\n${JSON.stringify(hosts, null, 4)}`);
    console.log(`The following search term(s) returned no results:\n${missing}`);
  })
  .catch(err => console.log(err));

var arpping = new Arpping(options);
var type = 'RaspberryPi';
arpping.searchByMacType(type)
  .then(hosts => console.log(`${hosts.length} host(s) found with type: ${type}\n${JSON.stringify(hosts, null, 4)}`))
  .catch(err => console.log(err));


var arpping = new Arpping(options);
var ipArray = null; // set to null to scan the full ip range
arpping.ping(ipArray)
  .then(({ hosts, missing }) => console.log(`${hosts.length} host(s) found:\n${hosts}`))
  .catch(err => console.log(err));

var ipArray = [
  "192.168.0.3", 
  "192.168.0.12", 
  "192.168.0.24"
];
arpping.ping(ipArray)
  .then(({ hosts, missing }) => {
    console.log(`${hosts.length} matching host(s) found:\n${JSON.stringify(hosts, null, 4)}`);
    console.log(`The following ip address(es) returned no results:\n${missing}`)
  })
  .catch(err => console.log(err));
