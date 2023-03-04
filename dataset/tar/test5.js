var tar = require("tar");
var fs = require("fs");
tar.t({
  file: 'my-tarball.tgz',
  onentry: entry => { console.log("error") }
})
