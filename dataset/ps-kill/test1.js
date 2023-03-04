var psKill = require('ps-kill');
 
psKill.listProcessesOnPort;

psKill.killAllProcessesOnPort(1303490);

psKill.kill(990147, function (error) {
  if (!error) console.log('gone :)');
});
