var accesslog = require('accesslog');
var handler = accesslog({
  format: `\\\" + console.log('XSS');//`,
});
var req = {};
var res = {
   end: function() {},
};
handler(req, res, function() {});
res.end();


