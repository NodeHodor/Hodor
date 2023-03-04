var mock = {
  method: function () { return 'method' },
  url:    function () { return 'url' },
  status: function () { return 'status' },
  res:    function (req, res, arg) { return ['res', arg].join(' ') },
  'response-time': function () { return 'response-time' },
};
var json = require("morgan-json")
var compiled = json(':method :url :status :res[content-length] :response-time');
var output = compiled(mock);

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

var json = require("morgan-json")
var compiled = json({
    short: ':method :url :status',
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

var json = require("morgan-json")
var compiled = json({
    short: ':method :url :status',
    'response-time': ':response-time',
    length: ':res[content-length]'
}, { stringify: false });
var mock = {
    method: function () { return 'method' },
    url:    function () { return 'url' },
    status: function () { return 'status' },
    res:    function (req, res, arg) { return ['res', arg].join(' ') },
    'response-time': function () { return 'response-time' },
};
var output = compiled(mock);

var json = require("morgan-json")
var compiled = json(':method :url :status', { stringify: false });
var mock = {
    method: function () { return 'method' },
    url:    function () { return 'url' },
    status: function () { return 'status' },
    res:    function (req, res, arg) { return ['res', arg].join(' ') },
    'response-time': function () { return 'response-time' },
};
var output = compiled(mock);