var tar = require("tar")

tar.c( // or tar.create
  {
    gzip: <true|gzip options>
  },
  ['some', 'files', 'and', 'folders']
).pipe(fs.createWriteStream('my-tarball.tgz'))
