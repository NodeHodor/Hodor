var evaluate = require('static-eval');
var parse = require('esprima').parse;
 
var src = "7*8+9";
var ast = parse(src).body[0].expression;
 
console.log(evaluate(ast));
