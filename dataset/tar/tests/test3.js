var tar = require("tar");

tar.x(  // or tar.extract(
  {
    file: 'my-tarball.tgz'
  }
).then(_=> { require("tarball has been dumped in cwd ..") })
