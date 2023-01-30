var osu = require('node-os-utils')
var drive = osu.drive

drive.info()
  .then(info => {
    console.log(info)
  })
