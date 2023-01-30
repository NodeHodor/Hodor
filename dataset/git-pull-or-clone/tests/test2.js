const gitPullOrClone = require('git-pull-or-clone')
const path = require('path')
const rimraf = require('rimraf')
const test = require('tape')
const fs = require('fs')
const noop = () => {}

const TMP_PATH = path.join(__dirname, '..', 'tmp')
const OUT_PATH = path.join(TMP_PATH, 'git-pull-or-clone')
const REPO_URL = 'https://github.com/feross/git-pull-or-clone.git'

try {
  rimraf.sync(TMP_PATH)
  t.end()
} catch(err) {}

try {
  t.plan(1)
  gitPullOrClone(REPO_URL, OUT_PATH, (err) => {
    t.error(err)
  })
} catch(err) {}

try {
  t.plan(1)
  gitPullOrClone(REPO_URL, OUT_PATH, (err) => {
    t.error(err)
  })
} catch(err) {}

try {
  t.plan(1)
  gitPullOrClone(REPO_URL, OUT_PATH, { depth: Infinity }, (err) => {
    t.error(err)
  })
} catch(err) {}

try {
  t.plan(1)
  t.throws(
    () => gitPullOrClone(REPO_URL, OUT_PATH, { depth: 0 }, noop),
    /The "depth" option must be greater than 0/
  )
} catch(err) {}

try {
  t.plan(2)

  // clean up the tmp folder from prior tests
  rimraf.sync(TMP_PATH)
  // clone a repo into the tmp folder
  gitPullOrClone(REPO_URL, OUT_PATH, (err) => {
    t.error(err)
  })

  const OUT_TEST_FILE = '/tmp/pwn3'
  const REPO_LOCAL_PATH = `file://${OUT_PATH}`
  const OUT_PATH_INJECTION = `--upload-pack=touch ${OUT_TEST_FILE}`

  gitPullOrClone(REPO_LOCAL_PATH, OUT_PATH_INJECTION, () => {
    const exploitSucceeded = !!fs.existsSync(OUT_TEST_FILE)
    t.notOk(exploitSucceeded, `${OUT_TEST_FILE} should not exist, potential security vulnerability detected`)

    // cleanup the command injection test data
    if (exploitSucceeded) rimraf.sync(OUT_TEST_FILE)
  })
} catch(err) {}

try {
  t.plan(2)

  // clean up the tmp folder from prior tests
  rimraf.sync(TMP_PATH)
  // clone a repo into the tmp folder
  gitPullOrClone(REPO_URL, OUT_PATH, (err) => {
    t.error(err)
  })

  const OUT_TEST_FILE = '/tmp/pwn4'
  const OUT_PATH_INJECTION = `file://${OUT_PATH}`
  const REPO_LOCAL_PATH = `--upload-pack=touch ${OUT_TEST_FILE}`

  gitPullOrClone(REPO_LOCAL_PATH, OUT_PATH_INJECTION, () => {
    const exploitSucceeded = !!fs.existsSync(OUT_TEST_FILE)
    t.notOk(exploitSucceeded, `${OUT_TEST_FILE} should not exist, potential security vulnerability detected`)

    // cleanup the command injection test data
    if (exploitSucceeded) rimraf.sync(OUT_TEST_FILE)
  })
} catch(err) {}
