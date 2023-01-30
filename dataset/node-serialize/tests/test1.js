var serialize = require('node-serialize');

var obj = {
  name: 'Bob',
  say: function() {
    return 'hi ' + this.name;
  }
};

var objS = serialize.serialize(obj);
typeof objS === 'string';
serialize.unserialize(objS).say() === 'hi Bob';


