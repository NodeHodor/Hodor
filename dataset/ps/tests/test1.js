const ps = require('ps');
 
const [ proc ] = ps({ pid: 12345 });
 
console.log(proc); // { "pid": 12345, "comm": "node" }
 
const procs = ps({ pid: [ 23456, 34567 ] });
 
console.log(procs); // [ { "pid": 23456, "comm": "node" }, { "pid": 34567, "comm": "node" }
 
