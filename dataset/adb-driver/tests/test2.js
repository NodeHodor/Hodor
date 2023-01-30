const adbDriver = require('adb-driver')
const { execADBCommand } = adbDriver
 
async function getDevices(callback) {
  const result = await execADBCommand(`adb devices`)
  if (result instanceof Error) {
    console.error(`fail to execute adb devices`)
    return callback(result)
  }
  console.log(`you can parse your devices info here`)
  callback(null, result)
}
