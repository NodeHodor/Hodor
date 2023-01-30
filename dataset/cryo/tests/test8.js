var Cryo = require('cryo');

var original = {};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myString: 'my string'
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myNum: -128
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myBool: false
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myArray: ['a', 2, 3, 'd', false, true]
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myNull: null
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myUndefined: undefined
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
myString: 'my string',
myNum: 128,
myArray: ['a', 2, 3, 'd', false, true],
myBool: false,
myNull: null,
myUndefined: undefined
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);

var original = {
first: {
    second: {
    myString: 'my string',
    myNum: 128,
    myArray: ['a', 2, 3, 'd', false, true],
    myBool: false,
    myNull: null,
    myUndefined: undefined
    },
    secondSibling: [1, 2, 3],
    thirdSibling: undefined
},
firstSibling: 'hello'
};
var stringified = Cryo.stringify(original);
var hydrated = Cryo.parse(stringified);
