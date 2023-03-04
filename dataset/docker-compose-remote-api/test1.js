var DockerCompose = require("docker-compose-remote-api");
var docker = DockerCompose({cwd: "./"}).DockerRemoteAPI({
    host: '127.0.0.1',
    port: 2375
});


docker.getContainerId("test", function(err, id){
    if(err) console.log(err);
    else{
        var container = docker.dockerode.getContainer(id);
        container.inspect(function (err, data) {
            console.log(data);
        });
    }
});

var DockerCompose = require("docker-compose-remote-api");
var docker2 = DockerCompose({cwd: "./"})

docker2.ps(()=>{});
docker2.build("test", ()=>{}, ()=>{});
docker2.create("test", ()=>{}, ()=>{});
// docker2.events(()=>{}, ()=>{}, ()=>{});
docker2.config();
docker2.up("test", ()=>{}, ()=>{});
docker2.restart("test", ()=>{}, ()=>{}, ()=>{});
docker2.down("test", ()=>{}, ()=>{});
docker2.exec("test", "ls", ()=>{}, ()=>{}, ()=>{});
docker2.run("test", "ls", ()=>{}, ()=>{}, ()=>{});
docker2.kill("test", ()=>{}, ()=>{}, ()=>{});
docker2.rm("test", ()=>{}, ()=>{}, ()=>{});