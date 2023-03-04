var Git = require("git").Git; 
var repo = new Git("repo-test"); 
var user_input = "version; date";
repo.git(user_input, function(err, result) { console.log(result); })