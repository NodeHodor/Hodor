var morgan = require('morgan');
var f = morgan('25 \\" + console.log(\'hello!\'); +  //:method :url :status :res[content-length] - :response-time ms');
f({}, {}, function () {
});