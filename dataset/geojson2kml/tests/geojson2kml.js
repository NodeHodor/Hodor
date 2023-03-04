var geojson2kml = require('../index.js'),
    should = require('should'),
    path = require('path')

describe('geojson2kml', function(){
  it('should take a geojson file and output a kml file', function(done){
    geojson2kml(path.resolve(__dirname+'/in.geojson'), path.resolve(__dirname+'/out.kml'), function(err){
      if(err) throw err
      done()
    })
  })
})