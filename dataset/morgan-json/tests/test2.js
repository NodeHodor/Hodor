var mock = {
    method: function () { return 'method' },
    url:    function () { return 'url' },
    status: function () { return 'status' },
    res:    function (req, res, arg) { return ['res', arg].join(' ') },
    'response-time': function () { return 'response-time' },
};
var json = require("morgan-json")
var compiled = json(':method :url :status :res[content-length] bytes :response-time ms');
var output = compiled(mock);