const test = require('tape')
const foo = require('./')

test('foo', function (t) {
  t.plan(1)
  t.equal(foo(), 42)
})
