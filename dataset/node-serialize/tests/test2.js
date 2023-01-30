var serialize = require('node-serialize');

var objWithSubObj = {
  obj: {
    name: 'Jeff',
    say: function() {
      return 'hi ' + this.name;
    }
  }
};

var objWithSubObjS = serialize.serialize(objWithSubObj);
typeof objWithSubObjS === 'string';
serialize.unserialize(objWithSubObjS).say() === 'hi Jeff';
