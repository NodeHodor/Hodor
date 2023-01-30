var Cryo = require('cryo');

var original = null;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

 