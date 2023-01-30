var osu = require('node-os-utils')
var cpu = osu.cpu

var info = cpu.average()

console.log(info)
