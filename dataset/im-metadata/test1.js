var metadata = require('im-metadata');

metadata('small.jpg', {exif: true}, function(error, metadata) {
  if (error) { console.error(error); }
  console.log(metadata);
  console.log(metadata.exif);
});
