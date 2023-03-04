const freespace = require('freespace');

freespace.check('/')
.then(bytes => {
    console.log(bytes);
})
.catch(e => {
    console.error(e);
});

freespace.check('tmp', (err, bytes) => {
    if (err) {
        console.error(err);
    } else {
        console.log(bytes);
    }
});

try {
    let bytes = freespace.checkSync('/tmp');
    console.log(bytes);
} catch (e) {
    console.error(e);
}
