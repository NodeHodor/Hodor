var Cryo = require('cryo');

var original = new Date();
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = new Date();
original.attached = 'some property';
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);
