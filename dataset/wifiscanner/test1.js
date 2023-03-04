const wifiscanner = require("wifiscanner");
 
//Returns appropriate instance of a wifi scanner
const scanner = wifiscanner();
 
scanner.scan((error, networks) => {
    if(error) {
        console.error(error);
    } else {
        console.dir(networks);
    }
});

