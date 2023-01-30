var osu = require('node-os-utils')
var cpu = osu.cpu

cpu.usage()
  .then(info => {
    console.log(info)
  })
