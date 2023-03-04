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
// serialize.unserialize(objWithSubObjS).say() === 'hi Jeff';

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
serialize.unserialize(objWithSubObjS);


// var obj = {
//   name: 'Bob',
//   say: function() {
//     return 'hi ' + this.name;
//   },
//   nl: null
// };

// var objWithSubObj = {
//   obj: {
//     name: 'Jeff',
//     say: function() {
//       return 'hi ' + this.name;
//     }
//   }
// };

var objCircular = {};
objCircular.self = objCircular;

var objWithNativeCode = {
  // method: {}.hasOwnProperty
};

// var objWithNativeCode = {
//   obj: {
//     method: {}.hasOwnProperty
//   },
//   method: {}.hasOwnProperty
// };

// describe('Serialize#serialize(obj, ignoreNativeCode)', function() {
//   it(
    serialize.serialize(obj)
  // });

  // it(
    // (function() {
      serialize.serialize(objCircular);
    // })
  // });

  // it(
    // (function() {
      serialize.serialize(objWithNativeCode);
    // })
  // });

  // it(
    // (function() {
      serialize.serialize(objWithNativeCode, true);
    // })
//   });
// });

// describe('Serialize#unserialize(obj)', function() {
  // it(
    var objSer = serialize.unserialize(serialize.serialize(obj));
  // });

  // it(
    serialize.unserialize(serialize.serialize(obj)).say()
  // });

  // it(
    serialize.unserialize(serialize.serialize(objWithSubObj)).obj.say()
  // });

  // it(
    serialize.unserialize(serialize.serialize(objCircular)).self.self
  // });

  // it(
    // (function() {
      serialize.unserialize(serialize.serialize(objWithNativeCode, true))
    // })
//   });
// });


