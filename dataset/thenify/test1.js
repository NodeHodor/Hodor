
var assert = require('assert')

var promisify = require('thenify')

var setImmediate = global.setImmediate || function (fn) {
  process.nextTick(fn)
}

function fn(cb) {
  cb(null, true)
}

promisify(fn, { withCallback: true })().then(function (val) {
  assert.equal(val, true)
})

promisify(fn, { withCallback: true })(function (err, val) {
  assert.equal(val, true)
  // done()
})

function fn(cb) {
  cb(null, 1, 2, 3)
}

promisify(fn)().then(function (values) {
          assert.deepEqual(values, [1, 2, 3])
        })

promisify(fn)().then(function (values) {
          assert.deepEqual(values, [1, 2, 3])
        })

promisify(fn, { multiArgs: false })().then(function (value) {
        assert.equal(value, 1)
      })

promisify(fn, { multiArgs: [ 'one', 'tow', 'three' ] })().then(function (value) {
          assert.deepEqual(value, {
            one: 1,
            tow: 2,
            three: 3
          })
        })
        //     })
        //   })
        // })
        

//     it('set to array', function () {
//       return promisify(fn, { multiArgs: [ 'one', 'tow', 'three' ] })().then(function (value) {
//         assert.deepEqual(value, {
//           one: 1,
//           tow: 2,
//           three: 3
//         })
//       })
//     })
//   })
// })
