// example: make a directory in home directory such as ~/devcert-util
// ~/devcert-util/generate.js
const fs = require('fs');
const devcert = require('devcert');

// or if its just one domain - devcert.certificateFor('local.example.com')
devcert.certificateFor([
	'localhost',
	'local.api.example.com',
	'local.example.com',
	'local.auth.example.com'
])
	.then(({key, cert}) => {
		fs.writeFileSync('./certs/tls.key', key);
		fs.writeFileSync('./certs/tls.cert', cert);
	})
	.catch(console.error);
