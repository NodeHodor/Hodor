const {VM} = require('vm2');
new VM().run('this.constructor.constructor("return process")().exit()');
// Throws ReferenceError: process is not defined
