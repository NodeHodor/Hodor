const portprocesses = require('portprocesses');
const promise = portprocesses.listProcessesOnPort(8000); // this returns a promise
promise.then((result) => {
	console.log(result); // JSON array
	// [ { command: 'node',
	// pid: '123',
	// user: 'user',
	// fd: '22u',
	// type: 'IPv4',
	// device: '0x01abc3456d789012',
	// 'size/off': '0t0',
	// node: 'TCP',
	// name: '10.0.0.1:12345->123.456.7.89:http (CLOSE_WAIT)' } ]
});
promise.catch((err) => {
	console.error(err);
});

const promise1 = portprocesses.killAllProcessesOnPort(8000); // this returns a promise
promise1.then((result) => {
	console.log(result); // JSON array
	// [ { pid: '123'
	// success: true } ]
});
promise1.catch((err) => {
	console.error(err);
});
