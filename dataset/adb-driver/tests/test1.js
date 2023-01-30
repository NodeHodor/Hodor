const adbDriver = require('adb-driver')
const { execADBCommand } = adbDriver
 
execADBCommand(`adb devices`).then(result => {
  if (result instanceof Error) {
    console.error(`fail to execute adb devices`)
    return
  }
  console.info(`you can parse your devices info here: ${result}`)
})
