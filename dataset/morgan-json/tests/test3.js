var json = require("morgan-json")
var compiled = json({
    method: ':method',
    url: ':url',
    status: ':status',
    'response-time': ':response-time',
    length: ':res[content-length]'
});
var mock = {
    method: function () { return 'method' },
    url:    function () { return 'url' },
    status: function () { return 'status' },
    res:    function (req, res, arg) { return ['res', arg].join(' ') },
    'response-time': function () { return 'response-time' },
};
var output = compiled(mock);