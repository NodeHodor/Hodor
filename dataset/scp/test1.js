var scp = require('scp');
 
var options = {
  file: 'tmp',
  user: 'user',
  host: 'remote',
  // port: '22',
  path: '~'
}
 
scp.send(options, function (err) {
  if (err) console.log(err);
  else console.log('File transferred.');
});

scp.get({
  file: 'tmp', // remote file to grab
  user: 'user',   // username to authenticate as on remote system
  host: 'remote',   // remote host to transfer from, set up in your ~/.ssh/config
  // port: '22',         // remote port, optional, defaults to '22'
  path: './'           // local path to save to (this would result in a ~/file.txt on the local machine)
});
