var exec = require('ts-process-promises').exec;
var execFile = require('ts-process-promises').execFile;
var spawn = require('ts-process-promises').spawn;
var fork = require('ts-process-promises').fork;

exec('node ./a.js default')
    .on('process', function(process) {
        console.log('Pid: ', process.pid); 
    })
    // .then(function (result) {
    //     console.log('stdout: ', result.stdout);
    //     console.log('stderr: ', result.stderr);
    // })
    // .fail(function (err) {
    //     console.error('ERROR: ', err);
    // });


execFile(process.execPath, ['./a.js', 'default'])
    .on('process', function(process) {
        console.log('Pid: ', process.pid); 
    })
    // .then(function (result) {
    //     console.log('stdout: ', result.stdout);
    //     console.log('stderr: ', result.stderr);
    // })
    // .fail(function (err) {
    //     console.error('ERROR: ', err);
    // });

spawn(process.execPath, ['./a.js', 'default'])
    .on('process', function(process) {
        console.log('Pid: ', process.pid);
    })
    .on('stdout', function(line) {
        console.log('stdout: ', line); 
    })
    .on('stderr', function(line) {
        console.log('stdout: ', line); 
    })
    // .then(function (result) {
    //     console.log('Exit code: ' + result.exitCode);
    // })
    // .fail(function (err) {
    //     console.error('ERROR: ', err);
    // });

fork('./a.js', ['default'])
    // .on('process', function(process) {
    //     console.log('Pid: ', process.pid);
    // })
    // .on('stdout', function(line) {
    //     console.log('stdout: ', line); 
    // })
    // .on('stderr', function(line) {
    //     console.log('stdout: ', line); 
    // })
    // .then(function (result) {
    //     console.log('Exit code: ' + result.exitCode);
    // })
    // .fail(function (err) {
    //     console.error('ERROR: ', err);
    // });