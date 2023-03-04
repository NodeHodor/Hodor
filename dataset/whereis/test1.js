var whereis = require('whereis');
whereis('wget', function(err, path) {
  console.log(path);
});

whereis('ipython2', function(err, path) {
  console.log(path);
});
