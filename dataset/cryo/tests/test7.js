var Cryo = require('cryo');

var original = 123;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = 0;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = Infinity;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = -999;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = 333/444 + 0.00005;
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);
