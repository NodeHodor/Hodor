var thenify = require('thenify');
 
var promise = thenify(function (callback) {
  callback(null, 1, 2, 3);
}, { multiArgs: false });
 
// promise().then(function onFulfilled(value) {
//   assert.equal(value, 1);
// });
