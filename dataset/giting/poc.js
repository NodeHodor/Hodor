var Test = require("giting");
// var injection_command = ";echo vulnerable > create.txt;";
var injection_command = ";";
test = new Test({"workDir": "./"});
repo = {"organization": "./", "name": "./", "branch": injection_command}
test.pull(repo, function(){});
