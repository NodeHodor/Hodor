var tar = require("tar");

tar.t({
  file: 'my-tarball.tgz',
  onentry: entry => { .. do whatever with it .. }
})
