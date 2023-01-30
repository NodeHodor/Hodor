var osu = require('node-os-utils')
var mem = osu.mem

mem.info()
  .then(info => {
    console.log(info)
  })
