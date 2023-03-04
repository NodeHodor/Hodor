const adbDriver = require('adb-driver')
const { isSystemAdbAvailable, execADBCommand } = adbDriver

console.log(isSystemAdbAvailable());
 
execADBCommand(`adb devices`).then(result => {
  if (result instanceof Error) {
    console.error(`fail to execute adb devices`)
    return
  }
  console.info(`you can parse your devices info here: ${result}`)
})
