var Blamer = require("blamer")
var blamer = new Blamer('git');
blamer.getType()
blamer.blameByFile("blamer.test.js", "email")
var blamer = new Blamer('svn');
blamer.blameByFile("blamer.test.js", "-v")