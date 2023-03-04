const git = require('async-git');

`${await git.author} committed ${await git.message}` // Omri committed Some changes

git.reset(1) // reset number of commit back

git.reset('f5db755') // reset to specific SHA ID

git.tag('1.2.3')
