var tar = require("tar")
var fs = require("fs")
tar.c( // or tar.create
  {
    gzip: true
  },
  ['some', 'files', 'and', 'folders']
).pipe(fs.createWriteStream('my-tarball.tgz'))
