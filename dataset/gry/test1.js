// Dependencies
var Repo = require("gry")
    , fs = require("fs")
    , oneByOne = require("one-by-one")
    ;

// Create the repository
var myRepo = new Repo("./foo");
myRepo.create.bind(myRepo)
myRepo.init(()=>{});
myRepo.create(()=>{});
myRepo.pull(()=>{});
myRepo.branch(()=>{});
myRepo.checkout(()=>{});
myRepo.clone("https://github.com/xjamundx/gitblame.git", {}, ()=>{});
oneByOne([
    myRepo.create.bind(myRepo)
  , cb => {
        console.log("> Created the repository.");
        fs.writeFile("./foo/README", "Hello World!", cb);
    }
  , cb => {
        console.log("> Created README.md");
        // myRepo.
    }
  , cb => {
        console.log("> Added the files.");
        myRepo.commit("Initial commit.", cb);
    }
  , cb => {
        console.log("> Created the initial commit.");
        cb();
    }
], function (err) {
    console.log(err ? "An error appeared: " + err.stack : "Successfully done.");
});// Dependencies
var Repo = require("gry")
    , fs = require("fs")
    , oneByOne = require("one-by-one")
    ;

// Create the repository
var myRepo = new Repo("./foo2");
oneByOne([
    myRepo.create.bind(myRepo)
  , cb => {
        console.log("> Created the repository.");
        fs.writeFile("./foo/README", "Hello World!", cb);
    }
  , cb => {
        console.log("> Created README.md");
        myRepo.exec(['add', '.'], cb);
    }
  , cb => {
        console.log("> Added the files.");
        myRepo.commit("Initial commit.", cb);
    }
  , cb => {
    myRepo.exec(['commit', "-m message"], cb);
    }
  , cb => {
        console.log("> Created the initial commit.");
        cb();
    }
], function (err) {
    console.log(err ? "An error appeared: " + err.stack : "Successfully done.");
});
