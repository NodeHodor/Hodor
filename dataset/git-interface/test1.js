const { Git } = require('git-interface');

const git = new Git({
	dir: 'example' //default path is current directory
});

git.setDir('example');

git.init();

git.clone('https://github.com/yarkeev/git-interface.git', 'git-interface');
git.checkout('master');
git.updateSubmodules();
git.commit('message for annotate');
git.pull();
git.pull('test', { branch: 'feature1', rebase: true });
git.push();
git.add();
git.merge('branch-name');
git.merge('branch-name', '--squash');
git.fetch();
git.addRemote('origin', 'git@github.com:yarkeev/git-interface.git');
git.setRemote('origin', 'git@github.com:yarkeev/git-interface.git');
git.getRemotes();
git.getRemoteUrl('origin');
git.reset();
const hash = git.getHash('path/to/file');
const diff = git.diffMaster('path/to/file');
const branch = git.getBranchName();
git.createBranch('new-branch');
git.deleteBranch('existing-branch');
const diffFileList = git.getDiffByRevisionFileList('5e19a1d3c386a2607885627f3774d3d7746b60de');
const conflictList = git.getConflictList();
const uncomittedList = git.getUncommittedList();
const lastChanges = git.getLastChanges();
git.removeLocalBranch('branch-name');
git.removeRemoteBranch('branch-name');
var branches = git.getLocalBranchList();
var branches = git.getRemoteBranchList();
const timeOfLastCommit = git.getTimeOfLastCommit('branch-name');
const hashOfLastCommit = git.getHashOfLastCommit('branch-name');


