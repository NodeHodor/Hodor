var cwd = 'foo/bar';
var addRemote = require('git-add-remote')(cwd);
 
// async
// addRemote(name, url, callback);
 
// sync (requires node.js v0.11.12 or higher)
// addRemote.sync(name, url);

var addRemote = require('git-add-remote')();
 
addRemote('foo', 'https://foo.git', function(err) {
  if (err) return console.log(err);
});

var addRemote = require('git-add-remote')();
addRemote('foo', 'https://foo.git', ()=>{});
addRemote.sync('foo', 'https://foo.git');
addRemote.sync('bar', 'https://bar.git');
addRemote.sync('baz', 'https://baz.git');
