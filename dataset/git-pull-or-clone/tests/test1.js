const gitPullOrClone = require('git-pull-or-clone')

gitPullOrClone('git@github.com:feross/standard.git', '/path/to/destination', (err) => {
  if (err) throw err
  console.log('SUCCESS!')
})
