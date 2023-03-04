var killport = require('killport');

killport(8080)
// if success
.then(function(out){
  console.log(out);
})
// if failed
.catch(function(err){
  console.log(err);
});
