var thenify = require('thenify');
 
var somethingAsync = thenify(function somethingAsync(a, b, c, callback) {
  callback(null, a, b, c);
}, { withCallback: true });
 
// somethingAsync(a, b, c).then(onFulfilled).catch(onRejected);
// somethingAsync(a, b, c, function () {});
