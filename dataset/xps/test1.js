var ps = require('xps');

ps.list().fork(
  function(error) {
    throw error
  },
  function(processes) {
    processes.forEach(function(process){
      console.log(process.name + ': ' + process.pid)
    })
  }
);

ps.kill(123).fork(
  function(error){ console.log('Unable to kill 123') },
  function(){ console.log('Killed 123') }
);