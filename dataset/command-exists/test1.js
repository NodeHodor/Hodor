var commandExists = require('command-exists');
 
commandExists('ls', function(err, commandExists) {
 
    if(commandExists) {
        // proceed confidently knowing this command is available
    }
 
});
var commandExistsSync = require('command-exists').sync;
if (commandExistsSync('ls')) {
    // proceed
} else {
    // ...
}
commandExistsSync('fdsafdsafdsafdsafdsa')

var commandToUse = 'ls'
commandExists(commandToUse, function(err, exists) {
});

commandExists('fdsafdsafdsafdsafdsa', function(err, exists) {
});

var commandToUse = 'ls'


commandExists(commandToUse)

commandExists('fdsafdsafdsafdsafdsa')
var commandToUse = 'ls'
commandExistsSync(commandToUse);

commandExistsSync('fdsafdsafdsafdsafdsa')

commandExistsSync('ls')

console.log("finished!!!")
var commandToUse = 'tests/non-executable-script.js'
commandExists(commandToUse)

var commandToUse = 'tests/executable-script.js'
commandExists(commandToUse)