var geojson2kml = require('geojson2kml')

geojson2kml('polygons.geojson', 'polygons.kml', function(err){
  if(err) throw err
})