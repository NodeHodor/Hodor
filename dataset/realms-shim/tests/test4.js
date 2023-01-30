let Realm = require('realms-shim');

var r = Realm.makeRootRealm();

  // strict mode should prevent this
r.evaluate('var evil = 666')

r.global.victim = 3;
r.evaluate('victim = 666');
r.global.victim

