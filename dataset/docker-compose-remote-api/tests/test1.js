var DockerCompose = require("docker-compose-remote-api");
var docker = DockerCompose({cwd: __dirname}).DockerRemoteAPI({
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
