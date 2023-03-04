var ps = require('psnode');
 
ps.list(function(err, results) {
  if (err)
    throw new Error( err );
 
  console.log(results); // [{pid: 2352, command: 'command'}, {...}]
});

ps.kill(12345, function(err, stdout) {
  if (err)
    throw new Error(err);
 
  console.log(stdout); // stdout for kill or taskkill command if any
});
