var safeEval = require('notevil')

var func = safeEval.Function('param', 'return param * 100')
var result = func(2)
console.log(result) // 200
