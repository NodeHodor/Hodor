var Cryo = require('cryo');

var original = function(from, to) {
    return 'hello world from ' + from + ' to ' + to;
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var result1 = original('Hunter', 'you');
var result2 = hydrated('Hunter', 'you');


var original = function(from, to) {
    return 'hello world from ' + from + ' to ' + to;
};
original.attached = 'some property';
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var result1 = original('Hunter', 'you');
var result2 = hydrated('Hunter', 'you');
