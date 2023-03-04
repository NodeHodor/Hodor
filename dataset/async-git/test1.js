const git = require('async-git');

`${git.author} committed ${git.message}` // Omri committed Some changes

git.reset(1) // reset number of commit back

git.reset('f5db755') // reset to specific SHA ID

git.tag('1.2.3')

git.modified('./index.js')


git.body
git.branch
git.changed
git.comitter
git.date
git.email
git.message
git.name
git.origin
git.owner
git.sha
git.short
git.staged
git.subject
git.tags
git.unadded
git.unstaged
git.untracked
git.version

