const ps_visitor = require('ps-visitor');


ps_visitor.ps({
  pid: '233',
}, '').then((result) => {
  console.log(result);
});
 
ps_visitor.ps({
  cpu: '0.6',
}, '').then((result) => {
  console.log(result);
});

ps_visitor.ps({
  user: 'nodejs',
}, 'grep node.js').then((result) => {
  console.log(result);
});

// ps_visitor.kill(981606, "-9");


ps_visitor.getSignalRaw("XCPU");

