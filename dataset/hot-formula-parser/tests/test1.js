var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();

parser.parse('SUM(1, 6, 7)'); // It returns `Object {error: null, result: 14}`
