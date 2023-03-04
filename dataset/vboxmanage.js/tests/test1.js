var VBox = require('vboxmanage.js');
 
VBox.start('test')
  .then(function () {
    return VBox.execOnVm('Ubuntu x64', 'user', 'password', 'my-program', ['--my-argument', 'another argument']);
  })
  .then(function () {
    return VBox.mkdir('Ubuntu x64', 'user', 'password', '/var/usr/test', true /* recursive */);
  })
  .then(function () {
    return VBox.takeSnapshot('Ubuntu x64', 'my snapshot name');
  })
  .then(function () {
    return VBox.powerOff('Ubuntu x64');
  })
  .catch(function (err) {
    console.log(err);
  })
 
