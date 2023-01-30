var tar = require("tar")
tar.c(
  {
    gzip: true,
    file: 'my-tarball.tgz'
  },
  ['some', 'files', 'and', 'folders']
).then(_ => { console.log("tarball has been created .."); })
