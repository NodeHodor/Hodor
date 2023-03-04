
exec = require("child_process").exec;
let command = "echo''>pwned";
exec("jison " + command, function (error) {
});