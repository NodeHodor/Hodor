const { gitToJs } = require('git-parse');

const commitsPromise = gitToJs('path/to/repo/');

commitsPromise.then(commits => console.log(JSON.stringify(commits, null, 2)));