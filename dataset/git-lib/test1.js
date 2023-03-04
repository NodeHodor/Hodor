var git = require("git-lib");

git.haveFilesToCommit().then(function(){
    /** there are files to commit **/
}).catch(function(err){
    if (err === "There are no files to commit"){
        /** there are no files to commit **/
    }
    else {
        /** some error has occured **/
    }
});

git.add("example.file").then(function(){
    /** successfully added **/
}).catch(function(err){
    /** unsuccessful **/
});

git.getCurrentBranch().then(function(branchname){
    /** branchname has the name of current branch **/
}).catch(function(err){
    /** throws an error **/
});

git.showFilesAdded().then(function(filesAdded){
    /** filesAdded shows, in a string, a list of files added **/
}).catch(function(err){
    /** throws an error**/
});

git.showFilesModified().then(function(modifiedFiles){
    /** modifiedFiles is an array of files that has been modified **/
}).catch(function(err){
    /** throws an error **/
});

// git.commmit("message to commit", "--force").then(function(){
//     /** commit successful **/
// }).catch(function(err){
//     /** throws an error **/
// });

git.revert(["file1","file2"]).then(function(){
    /** successfully reverted **/
}).catch(function(err){
    /** throws an error **/
});

git.isGit().then(function(){
    /** has git initialized **/
}).catch(function(err){
    /** doesn't have git initialized, and err displays that **/
});

// if (git.isGitSync()){
//     /** has git initialized **/
// }
// else {
//     /** doesn't have git initialized **/
// }

git.getFilesCached().then(function(files){
    /** files is an array list of files that has been added **/
}).catch(function(err){
    /** throws an error **/
});


git.getBranches.local().then(function(branches){
    /** branches is an array of local branches **/  
}).catch(function(error){
    /** throws an error **/
});

git.getBranches.all().then(function(branches){
    /** branches is an array of all branches **/  
}).catch(function(error){
    /** throws an error **/
});

git.checkout("thisBranch").then(function(){
    /** successfully checked out into branch *thisBranch* **/
}).catch(function(err){
    /** throws an error **/
});

git.newBranch("newBranch").then(function(){
    /** new branch *newBranch* was successfully created **/
}).catch(function(err){
    /** throws an error **/
});

git.deleteBranch("thisbranch").then(function(){
    /** new branch *thisbranch* was successfully deleted**/
}).catch(function(err){
    /** throws an error **/
});

git.deleteBranches(/** array of branches name **/).then(function(result){
    /** result = { success: [ all the successfully deleted branches ], failure: [ all the branches that failed to be deleted ] } **/
});