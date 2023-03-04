var geojson2kml = require('geojson2kml')

geojson2kml('in.geojson', 'out.kml', function(err){
  if(err) throw err
})