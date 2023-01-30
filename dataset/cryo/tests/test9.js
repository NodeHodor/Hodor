var Cryo = require('cryo');

var original = [
"This is my simple string. Isn't it beautiful!?",
"Here is a mustache: {{"
].join('\n');
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);


var original = '';
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

 