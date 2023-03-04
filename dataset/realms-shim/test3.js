let Realm = require('realms-shim');

var r = Realm.makeRootRealm();



function addKilroy(global) {
  global.kilroy = 'was here';
}
const shim1 = `${addKilroy} addKilroy(this)`;
const shim2 = `this.kilroy += ' but he left';`;


var r = Realm.makeRootRealm({ shims: [shim1] });
r.global.kilroy
  
var r = Realm.makeRootRealm({ shims: [shim1, shim2] });
r.global.kilroy



var r1 = Realm.makeRootRealm({ shims: [shim1] });
var r2 = r1.evaluate(
    `Realm.makeRootRealm({shims: [${JSON.stringify(shim2)}]})`
    );
r1.global.kilroy
r2.global.kilroy

const r3root = r2.evaluate(`Realm.makeRootRealm()`);
r3root.global.kilroy

// compartments have their own global, so they don't take shims
const r3compartment = r2.evaluate(`Realm.makeCompartment()`);
r3compartment.global.kilroy

// but a new RootRealm *under* that compartment *should* get the shims of
// the nearest enclosing RootRealm
const r4 = r3compartment.evaluate(`Realm.makeRootRealm()`);
r4.global.kilroy





const shim = `(() => { try { this.Array = 999; } catch (e) {} })()`;

var r1 = Realm.makeRootRealm({ shims: [shim] });

var r2 = Realm.makeRootRealm({
    shims: [shim],
    configurableGlobals: true
    });


var c2 = r2.evaluate(`Realm.makeCompartment()`);


