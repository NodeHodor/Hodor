const ps = require('ps');
 
ps({ pid: 12345 }, ()=>{});
 

ps({ pid: [ 23456, 34567 ] }, ()=>{});

// {
//     pid: 12345 || [ 23456, 34567 ],  // Search by pid
//     ppid: 12345 || [ 23456, 34567 ],  // Search by parent pid
//     user: "bob",  // Search by user
//     group: "users",  // Search by group
//     command: "node",  // Search by command
//     all: true,  // List all processes
//     fields: [ 'pid', 'comm' ]  // The fields to return
// }

ps.lookup({ pid: "123" }, ()=>{})
ps.lookup({ pid: 12 }, ()=>{})
ps.lookup({ user: "nodejs" }, ()=>{})
ps.lookup({ user: "root" }, ()=>{})
ps.lookup({ command: "node"}, ()=>{})
ps.lookup({ command: "node"}, ()=>{})
ps.lookup({}, ()=>{})