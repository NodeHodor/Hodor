var accesslog = require('accesslog');
var handler = accesslog({
  format: "",
});
var req = {};
var res = {
   end: function() {},
 };
 handler(req, res, function() {});
 res.end();

 function test(a, b){
     b()
 }
 test(c, function (){})
