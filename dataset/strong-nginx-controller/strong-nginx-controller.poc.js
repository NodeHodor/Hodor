var Root = require("strong-nginx-controller");
var baseDir = "";
var nginxPath = "./";
var controlEndpoint = {
    hostname: "abd",
    port: 123
}
var listenEndpoint = 12;
var nginxRoot = "";
var root = new Root(baseDir, nginxPath, controlEndpoint, listenEndpoint, nginxRoot);
var action = "& touch Song";
root._nginxCmd(action, function () {});
