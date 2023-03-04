var df = require('node-df');
 
df(function (error, response) {
    if (error) { throw error; }
 
    console.log(JSON.stringify(response, null, 2));
});

var options = {
        file: '/',
        prefixMultiplier: 'GB',
        isDisplayPrefixMultiplier: true,
        precision: 2
    };

df(options, function (error, response) {
    if (error) { throw error; }

    console.log(JSON.stringify(response, null, 2));
});
