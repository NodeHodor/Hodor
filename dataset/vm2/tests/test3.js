const {VM} = require('vm2');
const vm = new VM();

vm.run(`process.exit()`); // TypeError: process.exit is not a function
