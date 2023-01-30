var npm = require('enpeem');
npm.install({
  dir: '/code/my-sweet-node-app',
  dependencies: [
    'sails@0.10.1',
    'sails-disk@git://github.com/balderdashy/sails-disk.git#associations',
    'lodash'
  ]
  loglevel: 'silent',
  'cache-min': 999999999
}, function (err) { /* ... */ });
