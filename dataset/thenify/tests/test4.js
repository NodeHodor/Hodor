var thenify = require('thenify').withCallback;
 
var somethingAsync = thenify(function somethingAsync(a, b, c, callback) {
  callback(null, a, b, c);
});
 
// somethingAsync(a, b, c).then(onFulfilled).catch(onRejected);
// somethingAsync(a, b, c, function () {});
