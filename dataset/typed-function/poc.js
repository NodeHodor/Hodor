var typed = require("typed-function");

var fn = typed("(){}+console.log(\"hacked...\");function a", {     
    "": function () {} 
  });
