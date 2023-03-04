var commandExists = require('command-exists');
 
commandExists('ls', function(err, commandExists) {
 
    if(commandExists) {
        // proceed confidently knowing this command is available
    }
 
});
