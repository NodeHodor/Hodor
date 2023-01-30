let Realm = require('realms-shim');

const r = Realm.makeRootRealm();
  
r.evaluate('eval.toString()')
r.evaluate('""+eval')

r.evaluate('Object.getPrototypeOf(eval.toString)')
