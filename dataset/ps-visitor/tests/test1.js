const ps_visitor = require('ps-visitor');
 
ps_visitor.ps({
  command: '~SourceTree'
}, 'grep SourceTree').then((result) => {
  console.log(result);
});
