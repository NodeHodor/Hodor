const diskstats = require('diskstats');

//callback
diskstats.all((err, results) => {
    console.log(results);
});

//promise
diskstats.all().then((results) => {
    console.log(results);
}).catch((err) => {
    console.log(err);
})

//callback
diskstats.check('.', (err, results) => {
    console.log(results);
});

//promise
diskstats.check('.').then((results) => {
    console.log(results);
}).catch((err) => {
    console.log(err);
})
