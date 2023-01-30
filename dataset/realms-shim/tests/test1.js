let Realm = require('realms-shim');

const r = Realm.makeRootRealm();
r.evaluate('typeof 4')
r.evaluate('typeof undefined')
r.evaluate('typeof "a string"')
