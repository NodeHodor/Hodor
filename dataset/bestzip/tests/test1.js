var zip = require('bestzip');

zip({
  source: 'build/*',
  destination: './destination.zip'
}).then(function() {
  console.log('all done!');
}).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});

