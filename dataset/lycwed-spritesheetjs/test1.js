var spritesheet = require('lycwed-spritesheetjs');

var FORMAT = {extension: 'json', template: 'json.template'};

spritesheet(__dirname + '/fixtures/*', {name: 'test', path: __dirname, format: FORMAT}, function (err) {
});

spritesheet(__dirname + '/fixtures/*', {name: 'test', path: __dirname, format: FORMAT}, function (err) {
  });

spritesheet([__dirname + '/fixtures/100x100.jpg'], {name: 'test', path: __dirname, format: FORMAT}, function (err) {
});

spritesheet([__dirname + '/fixtures/100x100.jpg'], {name: 'test', path: __dirname, format: FORMAT}, function (err) {
});

spritesheet("assets", { ext: "png", format: "json" }, function(err) {
  if (err) throw err;

  console.log("spritesheet successfully generated");
});