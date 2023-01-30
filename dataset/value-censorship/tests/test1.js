'use strict'

const assert = require('assert')
const censor = require("value-censorship")

const identity = 'x = x => x;'

try{
    assert.equal(censor('return 42'), 42)
    assert.equal(censor('function foo () { return 42 }; return foo()'), 42)
    assert.throws(() => censor(identity + 'return x(eval)'))
    assert.throws(() => censor(identity + 'return x(Function)'))
    assert.throws(() => censor(identity + 'return x(require)'))
} catch(err) {}
try{
    assert.equal(censor('return foo("test")', { foo: x => x }), 'test')
} catch(err) {}
  try{
    assert.throws(() => censor('new Function("a", "return a")'))
} catch(err) {}
  try{
    assert.throws(() => censor('eval("666")'))
} catch(err) {}
  try{
    assert.throws(() => censor('global["eva" + "l"]')('42'))
} catch(err) {}
  try{
    assert.throws(() => censor('new (function(){}.constructor)("42")'))
} catch(err) {}
  try{
    assert.throws(() => censor('new (function *(){}.constructor)("42")'))
} catch(err) {}
  try{
    assert.throws(() => censor('try { } catch (e) {}'))
    censor('try {} finally {}')
} catch(err) {}

