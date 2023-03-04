umount = require('umount') 
 

umount.isMounted('/dev/disk555', (error, stdout, stderr) => {
  console.log(stdout);
})

umount.umount('/dev/disk555', (error, stdout, stderr) => {
  console.log(stdout);
})
