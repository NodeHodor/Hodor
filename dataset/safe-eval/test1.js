var safeEval = require('safe-eval')

var code = '"app" + "le"'
var evaluated = safeEval(code) // "apple"


// math
var code = 'Math.floor(22/7)'
var evaluated = safeEval(code) // 3.142857142857143

// JSON
var code = '{name: "Borat", hobbies: ["disco dance", "sunbathing"]}'
var evaluated = safeEval(code) // {name: "Borat", hobbies: ["disco dance", "sunbathing"]}

// function expression
var code = '(function square(b) { return b * b; })(5)'
var evaluated = safeEval(code) // 25

// no access to Node.js objects
// var code = 'process'
// safeEval(code) // THROWS!

// your own context API - access to Node's process object and a custom function
var code = '{pid: process.pid, apple: a()}'
var context = {
  process: process,
  a: function () { return 'APPLE' }
}
var evaluated = safeEval(code, context) // { pid: 16987, apple: 'APPLE' }

// pass an options object to the vm
// var code = 'process'
// safeEval(code, {}, { filename: 'myfile.js'}) // myfile.js can be seen in the stacktrace
