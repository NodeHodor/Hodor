var VBox = require('vboxmanage.js');
 
// VBox.start('Ubuntu');

VBox.isRegistered('Ubuntu');


VBox.modify('Ubuntu');

// VBox.mkdir(vmname='tmp', username='tmp', password='tmp', path='./test');