var osu = require('node-os-utils')
var cpu = osu.cpu

var count = cpu.count() // 8

cpu.usage()
  .then(cpuPercentage => {
    console.log(cpuPercentage) // 10.38
  })

var osCmd = osu.osCmd

osCmd.whoami()
  .then(userName => {
    console.log(userName) // admin
  })
