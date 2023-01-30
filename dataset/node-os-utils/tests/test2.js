var osu = require('node-os-utils')
var osCmd = osu.osCmd

osCmd
  .topCpu()
  .then(function(res){
    if(osu.isNotSupported(res)){
      // Handle 'not supported'
    }else{
      // Things to do...
    }
  })
