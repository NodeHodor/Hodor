var whereis = require('whereis');
whereis('wget', function(err, path) {
  console.log(path);
});
