var zip = require('bestzip');

zip({
  source: 'tests/*',
  destination: './destination1.zip'
}).then(function() {
  console.log('all done!');
}).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});

zip.nodeZip({
  source: 'tests/*',
  destination: './destination2.zip'
}).then(function() {
  console.log('all done!');
}).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});

zip.hasNativeZip();

zip.nativeZip({
  source: 'tests/*',
  destination: './destination3.zip'
}).then(function() {
  console.log('all done!');
}).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});
