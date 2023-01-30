var Cryo = require('cryo');

var original = true;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = false;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);
