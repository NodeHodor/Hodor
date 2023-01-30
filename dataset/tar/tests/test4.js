var fs = require("fs");
var tar = require("tar");

fs.createReadStream('my-tarball.tgz').pipe(
  tar.x({
    strip: 1,
    C: 'some-dir' // alias for cwd:'some-dir', also ok
  })
)
