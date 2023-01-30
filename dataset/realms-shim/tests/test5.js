let Realm = require('realms-shim');
var r = Realm.makeRootRealm();
r.evaluate(`endow1 + 2`, { endow1: 1 })





var r = Realm.makeRootRealm();
r.evaluate(`4`)





var r = Realm.makeRootRealm();

// assignment to endowments works
try{
r.evaluate(`var endow1 = 4; endow1`, { endow1: 1 })
r.evaluate(`endow1 += 4; endow1`, { endow1: 1 })

// the global is not modified when an endowment shadows it
r.evaluate(`endow1`)
r.global.endow1

// assignment to global works even when an endowment shadows it
r.evaluate(`this.endow1 = 4; this.endow1`, { endow1: 1 })
r.evaluate(`this.endow1 = 4; endow1`, { endow1: 1 })

// the modified global is now visible when there is no endowment to shadow it
r.global.endow1
r.evaluate(`endow1`)

// endowments shadow globals
r.evaluate(`endow1`, { endow1: 44 })
} catch(err) {}


