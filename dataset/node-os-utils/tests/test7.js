var osu = require('node-os-utils')
var netstat = osu.netstat

netstat.stats()
  .then(info => {
    console.log(info)
  })
