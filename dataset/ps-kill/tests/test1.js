var psKill = require('ps-kill');
 
psKill.kill(12345, function (error) {
  if (!error) console.log('gone :)');
});
