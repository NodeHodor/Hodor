var accesslog = require('accesslog')
  , http = require('http')
  , assert = require('assert')
  , port = 55222
  , baseUrl = 'http://localhost:' + port
  , tmpLog = '/tmp/access-policy.log'
  , exec = require('child_process').exec
  , fs = require('fs')
  ;

setTimeout(() => {
    console.log("Delayed for 1 second.");
    process.exit();
}, 10000);

var logger = accesslog({path: tmpLog});
var server =http.createServer(function(req, res) {
    logger(req, res, function() {
    var content = JSON.stringify({'hello': 'world'});
    res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length': content.length});
    res.write(content);
    res.end();
    });
}).listen(port, '127.0.0.1');



server.timeout = 20;
console.log('Server running at http://127.0.0.1:55222/');
