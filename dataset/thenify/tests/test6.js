var thenify = require('thenify');
 
var promise = thenify(function (callback) {
  callback(null, 1, 2, 3);
}, { multiArgs: [ 'one', 'tow', 'three' ] });
 
// promise().then(function onFulfilled(value) {
//   assert.deepEqual(value, {
//     one: 1,
//     tow: 2,
//     three: 3
//   });
// });
