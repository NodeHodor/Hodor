var Cryo = require('cryo');

var original = [1, 2, 3, 'a', 'b', 'c'];
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = [1, 2, 3, 'a', 'b', 'c'];
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = [
[ 0, 1, 2 ],
[ 3, 4, 5 ],
[ 'a', 'b', 'c' ]
];
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);


var original = [1, 2, 3];
original.attached = 'some property';
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);