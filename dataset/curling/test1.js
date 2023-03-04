var curl = require("curling");

var connection = curl.connect(null);
var connection = curl.connect({user: "hernan:secret"})
curl.run("--GET http://www.bing.ca", function (err, result) {
        console.log(result.stats);
      });
var connection = curl.connect({user: 'hernan:secret'});
connection = curl.connect({header: ["Accept: text/html"], user: 'hernan:secret'});

connection.head('http://www.bing.com', null, function (err, result) {
});

connection.head('http://www.bing.com', {header: ["Accept: text/html", "X-Custom: \"Hernan\""]}, function (err, result) {
});


connection.post('http://www.bing.com', {header: ["Accept: text/html"], user: 'hernan:secret'}, function (err, result) {
});

connection.put('http://www.bing.com', {header: ["Accept: text/html"], user: 'hernan:secret'}, function (err, result) {
});

connection.del('http://www.bing.com', {header: ["Accept: text/html"], user: 'hernan:secret'}, function (err, result) {
});