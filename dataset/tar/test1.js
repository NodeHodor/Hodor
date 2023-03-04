var tar = require("tar")
tar.c(
  {
    gzip: true,
    file: 'my-tarball.tgz'
  },
  ['some', 'files', 'and', 'folders']
).then(_ => { console.log("tarball has been created .."); })

var tar = require("tar")
var fs = require("fs")
tar.c( // or tar.create
  {
    gzip: true
  },
  ['some', 'files', 'and', 'folders']
).pipe(fs.createWriteStream('my-tarball.tgz'))

var tar = require("tar");

tar.x(  // or tar.extract(
  {
    file: 'my-tarball.tgz'
  }
).then(_=> { require("tarball has been dumped in cwd ..") })

var fs = require("fs");
var tar = require("tar");

fs.createReadStream('my-tarball.tgz').pipe(
  tar.x({
    strip: 1,
    C: 'some-dir' // alias for cwd:'some-dir', also ok
  })
)

var tar = require("tar");
var fs = require("fs");
tar.t({
  file: 'my-tarball.tgz',
  onentry: entry => { console.log("error") }
})
