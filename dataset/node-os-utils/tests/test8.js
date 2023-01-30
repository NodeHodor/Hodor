var osu = require('node-os-utils')
var netstat = osu.netstat

netstat.inOut()
  .then(info => {
    console.log(info)
  })
