var serialize = require('node-serialize');

var objCircular = {};
objCircular.self = objCircular;

var objCircularS = serialize.serialize(objCircular);
typeof objCircularS === 'string';
typeof serialize.unserialize(objCircularS).self.self.self.self === 'object';
