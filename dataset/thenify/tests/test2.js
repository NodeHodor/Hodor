var thenify = require('thenify');
 
var somethingAsync = thenify(function somethingAsync(a, b, c, callback) {
  callback(null, a, b, c);
});
