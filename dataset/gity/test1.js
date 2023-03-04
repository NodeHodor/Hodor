var Git = require('gity');
 
var git = Git()
  .add('*.js')
  .commit('-m "added js files"')
  .run();


var Git = require('gity');

var git = Git()
    .add('*.js')
    .commit('-m "added js files"')
    .status()
    .run(function(err, res){
        // ... { untracked: [], modified: [], created: [], deleted: [] };
    });

var Git = require('gity');

var git = Git({ pretty: false }) // passes stdout into res
    .add('*.js')
    .commit('-m "added js files"')
    .status()
    .run(function(err, res){
    // ...
    });
    
var Git = require('gity');

var git = Git({ base: '../repo' }) // sets the base folder to '../repo'
    .init()
    .run(function(err, res){
    // ...
    });


var git = new Git();
var git = Git({ base: '../' });
var git = Git({ pretty: false });

var folder = '/tmp/gity';
var git;

git
.init()
.run(function(err, res){
});
git
.init()
.add('index.js')
.run(function(err, res){
});
git
.init()
.add('index.js')
.commit('-m "test"')
.run(function(err, res){
})
git
.init()
.status()
.run(function(err, res){
});

git
.init()
.add('index.js')
.commit('-m "test"')
.log()
.run(function(err, res){
});