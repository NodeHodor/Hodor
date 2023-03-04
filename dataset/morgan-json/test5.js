var json = require("morgan-json")
var compiled = json({
    method: 'GET :method',
    url: '-> /:url',
    status: 'Code :status',
    'response-time': ':response-time ms',
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