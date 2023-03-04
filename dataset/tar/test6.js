var t = require('tap')

// run three scenarios
// unix (no fmap)
// win32 (without fmap support)
// win32 (with fmap support)

// var fs = require('fs')
// // var hasFmap = !!fs.varants.UV_FS_O_FILEMAP
// var platform = process.platform
// var UV_FS_O_FILEMAP = 0x20000000

// switch (process.argv[2]) {
//   case 'win32-fmap': {
//     if (!hasFmap) {
//       global.__FAKE_TESTING_FS__ = {
//         varants: {
//           ...fs.varants,
//           ...{ UV_FS_O_FILEMAP },
//         },
//       }
//     }
//     var { O_CREAT, O_TRUNC, O_WRONLY } = fs.varants
//     if (platform !== 'win32') {
//       process.env.__FAKE_PLATFORM__ = 'win32'
//     }
//     var getFlag = require('../lib/get-write-flag.js')
//     t.equal(getFlag(1), UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY)
//     t.equal(getFlag(512 * 1024 + 1), 'w')
//     break
//   }

//   case 'win32-nofmap': {
//     if (hasFmap) {
//       global.__FAKE_TESTING_FS__ = {
//         varants: {
//           ...fs.varants,
//           ...{ UV_FS_O_FILEMAP: 0 },
//         },
//       }
//     }
//     if (platform !== 'win32') {
//       process.env.__FAKE_PLATFORM__ = 'win32'
//     }
//     var getFlag = require('../lib/get-write-flag.js')
//     t.equal(getFlag(1), 'w')
//     t.equal(getFlag(512 * 1024 + 1), 'w')
//     break
//   }

//   case 'unix': {
//     if (platform === 'win32') {
//       process.env.__FAKE_PLATFORM__ = 'darwin'
//     }
//     var getFlag = require('tar').get-write-flag
//     t.equal(getFlag(1), 'w')
//     t.equal(getFlag(512 * 1024 + 1), 'w')
//     break
//   }

//   default: {
//     var node = process.execPath
//     t.spawn(node, [__filename, 'win32-fmap'])
//     t.spawn(node, [__filename, 'win32-nofmap'])
//     t.spawn(node, [__filename, 'unix'])
//   }
// }

var isWindows = process.platform === 'win32'
var t = require('tap')
// var c = require('../lib/create.js')
// var list = require('../lib/list.js')
var c = require('tar').create
var list = require('tar').list
var fs = require('fs')
var path = require('path')
var dir = path.resolve(__dirname, 'fixtures/create')
var tars = path.resolve(__dirname, 'fixtures/tars')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var spawn = require('child_process').spawn
// var Pack = require('../lib/pack.js')
var list = require('tar').pack
var mutateFS = require('mutate-fs')
var { promisify } = require('util')

var readtar = (file, cb) => {
  var child = spawn('tar', ['tf', file])
  var out = []
  child.stdout.on('data', c => out.push(c))
  child.on('close', (code, signal) =>
    cb(code, signal, Buffer.concat(out).toString()))
}

t.teardown(() => new Promise(resolve => rimraf(dir, resolve)))

t.before(async () => {
  await promisify(rimraf)(dir)
  await mkdirp(dir)
})

t.test('no cb if sync or without file', t => {
  t.throws(_ => c({ sync: true }, ['asdf'], _ => _))
  t.throws(_ => c(_ => _))
  t.throws(_ => c({}, _ => _))
  t.throws(_ => c({}, ['asdf'], _ => _))
  t.end()
})

t.test('create file', t => {
  var files = [path.basename(__filename)]

  t.test('sync', t => {
    var file = path.resolve(dir, 'sync.tar')
    c({
      file: file,
      cwd: __dirname,
      sync: true,
    }, files)
    readtar(file, (code, signal, list) => {
      t.equal(code, 0)
      t.equal(signal, null)
      t.equal(list.trim(), 'create.js')
      t.end()
    })
  })

  t.test('async', t => {
    var file = path.resolve(dir, 'async.tar')
    c({
      file: file,
      cwd: __dirname,
    }, files, er => {
      if (er) {
        throw er
      }
      readtar(file, (code, signal, list) => {
        t.equal(code, 0)
        t.equal(signal, null)
        t.equal(list.trim(), 'create.js')
        t.end()
      })
    })
  })

  t.test('async promise only', t => {
    var file = path.resolve(dir, 'promise.tar')
    c({
      file: file,
      cwd: __dirname,
    }, files).then(_ => {
      readtar(file, (code, signal, list) => {
        t.equal(code, 0)
        t.equal(signal, null)
        t.equal(list.trim(), 'create.js')
        t.end()
      })
    })
  })

  t.test('with specific mode', t => {
    var mode = isWindows ? 0o666 : 0o740
    t.test('sync', t => {
      var file = path.resolve(dir, 'sync-mode.tar')
      c({
        mode: mode,
        file: file,
        cwd: __dirname,
        sync: true,
      }, files)
      readtar(file, (code, signal, list) => {
        t.equal(code, 0)
        t.equal(signal, null)
        t.equal(list.trim(), 'create.js')
        t.equal(fs.lstatSync(file).mode & 0o7777, mode)
        t.end()
      })
    })

    t.test('async', t => {
      var file = path.resolve(dir, 'async-mode.tar')
      c({
        mode: mode,
        file: file,
        cwd: __dirname,
      }, files, er => {
        if (er) {
          throw er
        }
        readtar(file, (code, signal, list) => {
          t.equal(code, 0)
          t.equal(signal, null)
          t.equal(list.trim(), 'create.js')
          t.equal(fs.lstatSync(file).mode & 0o7777, mode)
          t.end()
        })
      })
    })

    t.end()
  })
  t.end()
})

t.test('create', t => {
  t.type(c({ sync: true }, ['README.md']), Pack.Sync)
  t.type(c(['README.md']), Pack)
  t.end()
})

t.test('open fails', t => {
  var poop = new Error('poop')
  var file = path.resolve(dir, 'throw-open.tar')
  t.teardown(mutateFS.statFail(poop))
  t.throws(_ => c({
    file: file,
    sync: true,
    cwd: __dirname,
  }, [path.basename(__filename)]))
  t.throws(_ => fs.lstatSync(file))
  t.end()
})

t.test('gzipped tarball that makes some drain/resume stuff', t => {
  var cwd = path.dirname(__dirname)
  var out = path.resolve(dir, 'package.tgz')

  // don't include node_modules/.cache, since that gets written to
  // by nyc during tests, and can result in spurious errors.
  var entries = fs.readdirSync(`${cwd}/node_modules`)
    .filter(e => !/^\./.test(e))
    .map(e => `node_modules/${e}`)

  c({ z: true, C: cwd }, entries)
    .pipe(fs.createWriteStream(out))
    .on('finish', _ => {
      var child = spawn('tar', ['tf', out], {
        stdio: ['ignore', 'ignore', 'pipe'],
      })
      child.stderr.on('data', c => {
        t.fail(c + '')
      })
      child.on('close', (code, signal) => {
        t.equal(code, 0)
        t.equal(signal, null)
        t.end()
      })
    })
})

t.test('create tarball out of another tarball', t => {
  var out = path.resolve(dir, 'out.tar')

  var check = t => {
    var expect = [
      'dir/',
      'Ω.txt',
      '🌟.txt',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt',
      'hardlink-1',
      'hardlink-2',
      'symlink',
    ]
    list({ f: out,
      sync: true,
      onentry: entry => {
        if (entry.path === 'hardlink-2') {
          t.equal(entry.type, 'Link')
        } else if (entry.path === 'symlink') {
          t.equal(entry.type, 'SymbolicLink')
        } else if (entry.path === 'dir/') {
          t.equal(entry.type, 'Directory')
        } else {
          t.equal(entry.type, 'File')
        }
        t.equal(entry.path, expect.shift())
      } })
    t.same(expect, [])
    t.end()
  }

//   t.test('sync', t => {
//     c({
//       f: out,
//       cwd: tars,
//       sync: true,
//     }, ['@dir.tar', '@utf8.tar', '@links.tar'])
//     check(t)
//   })

//   t.test('async', t => {
//     c({
//       f: out,
//       cwd: tars,
//     }, ['@dir.tar', '@utf8.tar', '@links.tar'], _ => check(t))
//   })

  t.end()
})

var t = require('tap')
var nock = require('nock')
var x = require('tar').extract
var path = require('path')
var fs = require('fs')
var extractdir = path.resolve(__dirname, 'fixtures/extract')
var tars = path.resolve(__dirname, 'fixtures/tars')
var mkdirp = require('mkdirp')
var { promisify } = require('util')
var rimraf = promisify(require('rimraf'))
var mutateFS = require('mutate-fs')
var pipeline = promisify(require('stream').pipeline)
var http = require('http')

var tnock = (t, host, opts) => {
  nock.disableNetConnect()
  var server = nock(host, opts)
  t.teardown(function () {
    nock.enableNetConnect()
    server.done()
  })
  return server
}

t.teardown(_ => rimraf(extractdir))

t.test('basic extracting', t => {
  var file = path.resolve(tars, 'utf8.tar')
  var dir = path.resolve(extractdir, 'basic')

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var check = async t => {
    fs.lstatSync(dir + '/Ω.txt')
    fs.lstatSync(dir + '/🌟.txt')
    t.throws(_ => fs.lstatSync(dir + '/long-path/r/e/a/l/l/y/-/d/e/e/p/-' +
                               '/f/o/l/d/e/r/-/p/a/t/h/Ω.txt'))

    await rimraf(dir)
    t.end()
  }

  var files = ['🌟.txt', 'Ω.txt']
  t.test('sync', t => {
    x({ file: file, sync: true, C: dir }, files)
    return check(t)
  })

  t.test('async promisey', t => {
    return x({ file: file, cwd: dir }, files).then(_ => check(t))
  })

  t.test('async cb', t => {
    return x({ file: file, cwd: dir }, files, er => {
      if (er) {
        throw er
      }
      return check(t)
    })
  })

  t.end()
})

// t.test('ensure an open stream is not prematuraly closed', t => {
//   t.plan(1)

//   var file = path.resolve(tars, 'long-paths.tar')
//   var dir = path.resolve(extractdir, 'basic-with-stream')

//   t.beforeEach(async () => {
//     await rimraf(dir)
//     await mkdirp(dir)
//   })

//   var check = async t => {
//     t.ok(fs.lstatSync(dir + '/long-path'))
//     await rimraf(dir)
//     t.end()
//   }

//   t.test('async promisey', t => {
//     var stream = fs.createReadStream(file, {
//       highWaterMark: 1,
//     })
//     pipeline(
//       stream,
//       x({ cwd: dir })
//     ).then(_ => check(t))
//   })

//   t.end()
// })

t.test('ensure an open stream is not prematuraly closed http', t => {
  t.plan(1)

  var file = path.resolve(tars, 'long-paths.tar')
  var dir = path.resolve(extractdir, 'basic-with-stream-http')

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var check = async t => {
    t.ok(fs.lstatSync(dir + '/long-path'))
    await rimraf(dir)
    t.end()
  }

  t.test('async promisey', t => {
    tnock(t, 'http://codeload.github.com/')
      .get('/npm/node-tar/tar.gz/main')
      .delay(250)
      .reply(200, () => fs.createReadStream(file))

    http.get('http://codeload.github.com/npm/node-tar/tar.gz/main', (stream) => {
      return pipeline(
        stream,
        x({ cwd: dir })
      ).then(_ => check(t))
    })
  })

  t.end()
})

t.test('file list and filter', t => {
  var file = path.resolve(tars, 'utf8.tar')
  var dir = path.resolve(extractdir, 'filter')

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var check = async t => {
    fs.lstatSync(dir + '/Ω.txt')
    t.throws(_ => fs.lstatSync(dir + '/🌟.txt'))
    t.throws(_ => fs.lstatSync(dir + '/long-path/r/e/a/l/l/y/-/d/e/e/p/-' +
                               '/f/o/l/d/e/r/-/p/a/t/h/Ω.txt'))

    await rimraf(dir)
    t.end()
  }

  var filter = path => path === 'Ω.txt'

  t.test('sync', t => {
    x({ filter: filter, file: file, sync: true, C: dir }, ['🌟.txt', 'Ω.txt'])
    return check(t)
  })

  t.test('async promisey', t => {
    return x({ filter: filter, file: file, cwd: dir }, ['🌟.txt', 'Ω.txt']).then(_ => {
      return check(t)
    })
  })

  t.test('async cb', t => {
    return x({ filter: filter, file: file, cwd: dir }, ['🌟.txt', 'Ω.txt'], er => {
      if (er) {
        throw er
      }
      return check(t)
    })
  })

  t.end()
})

t.test('no file list', t => {
  var file = path.resolve(tars, 'body-byte-counts.tar')
  var dir = path.resolve(extractdir, 'no-list')

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var check = async t => {
    t.equal(fs.lstatSync(path.resolve(dir, '1024-bytes.txt')).size, 1024)
    t.equal(fs.lstatSync(path.resolve(dir, '512-bytes.txt')).size, 512)
    t.equal(fs.lstatSync(path.resolve(dir, 'one-byte.txt')).size, 1)
    t.equal(fs.lstatSync(path.resolve(dir, 'zero-byte.txt')).size, 0)
    await rimraf(dir)
    t.end()
  }

  t.test('sync', t => {
    x({ file: file, sync: true, C: dir })
    return check(t)
  })

  t.test('async promisey', t => {
    return x({ file: file, cwd: dir }).then(_ => {
      return check(t)
    })
  })

  t.test('async cb', t => {
    return x({ file: file, cwd: dir }, er => {
      if (er) {
        throw er
      }
      return check(t)
    })
  })

  t.end()
})

t.test('read in itty bits', t => {
  var maxReadSize = 1000
  var file = path.resolve(tars, 'body-byte-counts.tar')
  var dir = path.resolve(extractdir, 'no-list')

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var check = async t => {
    t.equal(fs.lstatSync(path.resolve(dir, '1024-bytes.txt')).size, 1024)
    t.equal(fs.lstatSync(path.resolve(dir, '512-bytes.txt')).size, 512)
    t.equal(fs.lstatSync(path.resolve(dir, 'one-byte.txt')).size, 1)
    t.equal(fs.lstatSync(path.resolve(dir, 'zero-byte.txt')).size, 0)
    await rimraf(dir)
    t.end()
  }

  t.test('sync', t => {
    x({ file: file, sync: true, C: dir, maxReadSize: maxReadSize })
    return check(t)
  })

  t.test('async promisey', t => {
    return x({ file: file, cwd: dir, maxReadSize: maxReadSize }).then(_ => {
      return check(t)
    })
  })

  t.test('async cb', t => {
    return x({ file: file, cwd: dir, maxReadSize: maxReadSize }, er => {
      if (er) {
        throw er
      }
      return check(t)
    })
  })

  t.end()
})

t.test('bad calls', t => {
  t.throws(_ => x(_ => _))
  t.throws(_ => x({ sync: true }, _ => _))
  t.throws(_ => x({ sync: true }, [], _ => _))
  t.end()
})

t.test('no file', t => {
  var Unpack = require('../lib/unpack.js')
  t.type(x(), Unpack)
  t.type(x(['asdf']), Unpack)
  t.type(x({ sync: true }), Unpack.Sync)
  t.end()
})

t.test('nonexistent', t => {
  t.throws(_ => x({ sync: true, file: 'does not exist' }))
  x({ file: 'does not exist' }).catch(_ => t.end())
})

t.test('read fail', t => {
  var poop = new Error('poop')
  t.teardown(mutateFS.fail('read', poop))

  t.throws(_ => x({ maxReadSize: 10, sync: true, file: __filename }), poop)
  t.end()
})

t.test('sync gzip error edge case test', async t => {
  var file = path.resolve(__dirname, 'fixtures/sync-gzip-fail.tgz')
  var dir = path.resolve(__dirname, 'sync-gzip-fail')
  var cwd = process.cwd()
  await mkdirp(dir + '/x')
  process.chdir(dir)
  t.teardown(async () => {
    process.chdir(cwd)
    await rimraf(dir)
  })

  x({
    sync: true,
    file: file,
    onwarn: (c, m, er) => {
      throw er
    },
  })

  t.same(fs.readdirSync(dir + '/x').sort(),
    ['1', '10', '2', '3', '4', '5', '6', '7', '8', '9'])

  t.end()
})

// exports.ReadEntry = require('./lib/read-entry.js')
'use strict'
var t = require('tap')
var ReadEntry = require('tar').ReadEntry
var Header = require('tar').header

t.test('create read entry', t => {
  var h = new Header({
    path: 'oof.txt',
    mode: 0o755,
    uid: 24561,
    gid: 20,
    size: 100,
    mtime: new Date('2016-04-01T22:00Z'),
    ctime: new Date('2016-04-01T22:00Z'),
    atime: new Date('2016-04-01T22:00Z'),
    type: 'File',
    uname: 'isaacs',
    gname: 'staff',
  })
  h.encode()

  var entry = new ReadEntry(h, { x: 'y', path: 'foo.txt' }, { z: 0, a: null, b: undefined })

  t.ok(entry.header.cksumValid, 'header checksum should be valid')

  t.match(entry, {
    extended: { x: 'y', path: 'foo.txt' },
    globalExtended: { z: 0, a: null, b: undefined },
    header: {
      cksumValid: true,
      needPax: false,
      path: 'oof.txt',
      mode: 0o755,
      uid: 24561,
      gid: 20,
      size: 100,
      mtime: new Date('2016-04-01T22:00:00.000Z'),
      typeKey: '0',
      type: 'File',
      linkpath: null,
      uname: 'isaacs',
      gname: 'staff',
      devmaj: 0,
      devmin: 0,
      atime: new Date('2016-04-01T22:00:00.000Z'),
      ctime: new Date('2016-04-01T22:00:00.000Z'),
    },
    blockRemain: 512,
    remain: 100,
    type: 'File',
    meta: false,
    ignore: false,
    path: 'foo.txt',
    mode: 0o755,
    uid: 24561,
    gid: 20,
    uname: 'isaacs',
    gname: 'staff',
    size: 100,
    mtime: new Date('2016-04-01T22:00:00.000Z'),
    atime: new Date('2016-04-01T22:00:00.000Z'),
    ctime: new Date('2016-04-01T22:00:00.000Z'),
    linkpath: null,
    x: 'y',
    z: 0,
  })

  var data = ''
  var ended = false
  entry.on('data', c => data += c)
  entry.on('end', _ => ended = true)

  var body = Buffer.alloc(512)
  body.write(new Array(101).join('z'), 0)
  entry.write(body)
  entry.end()

  t.equal(data, new Array(101).join('z'))
  t.ok(ended, 'saw end event')

  t.end()
})

// t.test('meta entry', t => {
//   var h = new Header({
//     path: 'PaxHeader/foo.txt',
//     mode: 0o755,
//     uid: 24561,
//     gid: 20,
//     size: 23,
//     mtime: new Date('2016-04-01T22:00Z'),
//     ctime: new Date('2016-04-01T22:00Z'),
//     atime: new Date('2016-04-01T22:00Z'),
//     type: 'NextFileHasLongLinkpath',
//     uname: 'isaacs',
//     gname: 'staff',
//   })
//   var body = Buffer.alloc(512)
//   body.write('not that long, actually')

//   var expect = 'not that long, actually'
//   var actual = ''

//   var entry = new ReadEntry(h)
//   entry.on('data', c => actual += c)

//   entry.write(body.slice(0, 1))
//   entry.write(body.slice(1, 25))
//   entry.write(body.slice(25))
//   // t.throws(_ => entry.write(Buffer.alloc(1024)))

//   // t.equal(actual, expect)
//   // t.match(entry, { meta: true, type: 'NextFileHasLongLinkpath' })
//   // t.end()
// // })

// // t.test('unknown entry type', t => {
//   var h = new Header({
//     path: 'PaxHeader/foo.txt',
//     mode: 0o755,
//     uid: 24561,
//     gid: 20,
//     size: 23,
//     mtime: new Date('2016-04-01T22:00Z'),
//     ctime: new Date('2016-04-01T22:00Z'),
//     atime: new Date('2016-04-01T22:00Z'),
//     uname: 'isaacs',
//     gname: 'staff',
//   })
//   h.encode()
//   h.block.write('9', 156, 1, 'ascii')

//   var body = Buffer.alloc(512)
//   body.write('not that long, actually')

//   var expect = ''
//   var actual = ''

//   var entry = new ReadEntry(new Header(h.block))

//   entry.on('data', c => actual += c)

//   entry.write(body.slice(0, 1))
//   entry.write(body.slice(1, 25))
//   entry.write(body.slice(25))
// //   t.throws(_ => entry.write(Buffer.alloc(1024)))

// //   t.equal(actual, expect)
// //   t.match(entry, { ignore: true })
// //   t.end()
// // })

// t.test('entry without mode', t => {
//   var h = new Header({
//     path: 'foo.txt',
//     uid: 24561,
//     gid: 20,
//     size: 100,
//     mtime: new Date('2016-04-01T22:00Z'),
//     ctime: new Date('2016-04-01T22:00Z'),
//     atime: new Date('2016-04-01T22:00Z'),
//     type: 'File',
//     uname: 'isaacs',
//     gname: 'staff',
//   })
//   h.encode()

//   var entry = new ReadEntry(h)

//   t.ok(entry.header.cksumValid, 'header checksum should be valid')

//   t.match(entry, {
//     header: {
//       cksumValid: true,
//       needPax: false,
//       path: 'foo.txt',
//       mode: null,
//       uid: 24561,
//       gid: 20,
//       size: 100,
//       mtime: new Date('2016-04-01T22:00:00.000Z'),
//       typeKey: '0',
//       type: 'File',
//       linkpath: null,
//       uname: 'isaacs',
//       gname: 'staff',
//       devmaj: 0,
//       devmin: 0,
//       atime: new Date('2016-04-01T22:00:00.000Z'),
//       ctime: new Date('2016-04-01T22:00:00.000Z'),
//     },
//     blockRemain: 512,
//     remain: 100,
//     type: 'File',
//     meta: false,
//     ignore: false,
//     path: 'foo.txt',
//     mode: null,
//     uid: 24561,
//     gid: 20,
//     uname: 'isaacs',
//     gname: 'staff',
//     size: 100,
//     mtime: new Date('2016-04-01T22:00:00.000Z'),
//     atime: new Date('2016-04-01T22:00:00.000Z'),
//     ctime: new Date('2016-04-01T22:00:00.000Z'),
//     linkpath: null,
//   })

//   var data = ''
//   var ended = false
//   entry.on('data', c => data += c)
//   entry.on('end', _ => ended = true)

//   var body = Buffer.alloc(512)
//   body.write(new Array(101).join('z'), 0)
//   entry.write(body)
//   entry.end()

//   t.equal(data, new Array(101).join('z'))
//   t.ok(ended, 'saw end event')

//   t.end()
// })
'use strict'
var t = require('tap')
var r = require('tar').replace
var path = require('path')
var fs = require('fs')
var mutateFS = require('mutate-fs')
var list = require('tar').list
var { resolve } = require('path')

var fixtures = path.resolve(__dirname, 'fixtures')
var tars = path.resolve(fixtures, 'tars')
var zlib = require('zlib')

var spawn = require('child_process').spawn

var data = fs.readFileSync(tars + '/body-byte-counts.tar')
var dataNoNulls = data.slice(0, data.length - 1024)
var fixtureDef = {
  'body-byte-counts.tar': data,
  'no-null-eof.tar': dataNoNulls,
  'truncated-head.tar': Buffer.concat([dataNoNulls, data.slice(0, 500)]),
  'truncated-body.tar': Buffer.concat([dataNoNulls, data.slice(0, 700)]),
  'zero.tar': Buffer.from(''),
  'empty.tar': Buffer.alloc(512),
  'compressed.tgz': zlib.gzipSync(data),
}

t.test('basic file add to archive (good or truncated)', t => {
  var check = (file, t) => {
    var c = spawn('tar', ['tf', file], { stdio: [0, 'pipe', 2] })
    var out = []
    c.stdout.on('data', chunk => out.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0)
      t.equal(signal, null)
      var actual = Buffer.concat(out).toString().trim().split(/\r?\n/)
      t.same(actual, [
        '1024-bytes.txt',
        '512-bytes.txt',
        'one-byte.txt',
        'zero-byte.txt',
        path.basename(__filename),
      ])
      t.end()
    })
  }

  var files = [
    'body-byte-counts.tar',
    'no-null-eof.tar',
    'truncated-head.tar',
    'truncated-body.tar',
  ]
  var td = files.map(f => [f, fixtureDef[f]]).reduce((s, [k, v]) => {
    s[k] = v
    return s
  }, {})
  var fileList = [path.basename(__filename)]
  t.test('sync', t => {
    t.plan(files.length)
    var dir = t.testdir(td)
    for (var file of files) {
      t.test(file, t => {
        r({
          sync: true,
          file: resolve(dir, file),
          cwd: __dirname,
        }, fileList)
        check(resolve(dir, file), t)
      })
    }
  })

  t.test('async cb', t => {
    t.plan(files.length)
    var dir = t.testdir(td)
    for (var file of files) {
      t.test(file, t => {
        r({
          file: resolve(dir, file),
          cwd: __dirname,
        }, fileList, er => {
          if (er) {
            throw er
          }
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.test('async', t => {
    t.plan(files.length)
    var dir = t.testdir(td)
    for (var file of files) {
      t.test(file, t => {
        r({
          file: resolve(dir, file),
          cwd: __dirname,
        }, fileList).then(() => {
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.end()
})

t.test('add to empty archive', t => {
  var check = (file, t) => {
    var c = spawn('tar', ['tf', file])
    var out = []
    c.stdout.on('data', chunk => out.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0)
      t.equal(signal, null)
      var actual = Buffer.concat(out).toString().trim().split('\n')
      t.same(actual, [
        path.basename(__filename),
      ])
      t.end()
    })
  }

  var files = [
    'empty.tar',
    'zero.tar',
  ]
  var td = files.map(f => [f, fixtureDef[f]]).reduce((s, [k, v]) => {
    s[k] = v
    return s
  }, {})
  files.push('not-existing.tar')

  t.test('sync', t => {
    var dir = t.testdir(td)
    t.plan(files.length)
    for (var file of files) {
      t.test(file, t => {
        r({
          sync: true,
          file: resolve(dir, file),
          cwd: __dirname,
        }, [path.basename(__filename)])
        check(resolve(dir, file), t)
      })
    }
  })

  t.test('async cb', t => {
    var dir = t.testdir(td)
    t.plan(files.length)
    for (var file of files) {
      t.test(file, t => {
        r({
          file: resolve(dir, file),
          cwd: __dirname,
        }, [path.basename(__filename)], er => {
          if (er) {
            throw er
          }
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.test('async', async t => {
    var dir = t.testdir(td)
    t.plan(files.length)
    for (var file of files) {
      t.test(file, t => {
        r({
          file: resolve(dir, file),
          cwd: __dirname,
        }, [path.basename(__filename)]).then(() => {
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.end()
})

t.test('cannot append to gzipped archives', async t => {
  var dir = t.testdir({
    'compressed.tgz': fixtureDef['compressed.tgz'],
  })
  var file = resolve(dir, 'compressed.tgz')

  var expect = new Error('cannot append to compressed archives')
  var expectT = new TypeError('cannot append to compressed archives')

  t.throws(_ => r({
    file,
    cwd: __dirname,
    gzip: true,
  }, [path.basename(__filename)]), expectT)

  t.throws(_ => r({
    file,
    cwd: __dirname,
    sync: true,
  }, [path.basename(__filename)]), expect)

  return r({
    file,
    cwd: __dirname,
  }, [path.basename(__filename)], er => t.match(er, expect))
})

t.test('other throws', t => {
  t.throws(_ => r({}, ['asdf']), new TypeError('file is required'))
  t.throws(_ => r({ file: 'asdf' }, []),
    new TypeError('no files or directories specified'))
  t.end()
})

t.test('broken open', t => {
  var dir = t.testdir({
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  })
  var file = resolve(dir, 'body-byte-counts.tar')
  var poop = new Error('poop')
  t.teardown(mutateFS.fail('open', poop))
  t.throws(_ => r({ sync: true, file }, ['README.md']), poop)
  r({ file }, ['README.md'], er => {
    t.match(er, poop)
    t.end()
  })
})

t.test('broken fstat', t => {
  var td = {
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  }
  var poop = new Error('poop')
  t.test('sync', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    t.teardown(mutateFS.fail('fstat', poop))
    t.throws(_ => r({ sync: true, file }, ['README.md']), poop)
    t.end()
  })
  t.test('async', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    t.teardown(mutateFS.fail('fstat', poop))
    r({ file }, ['README.md'], async er => {
      t.match(er, poop)
      t.end()
    })
  })
  t.end()
})

t.test('broken read', t => {
  var dir = t.testdir({
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  })
  var file = resolve(dir, 'body-byte-counts.tar')
  var poop = new Error('poop')
  t.teardown(mutateFS.fail('read', poop))
  t.throws(_ => r({ sync: true, file }, ['README.md']), poop)
  r({ file }, ['README.md'], er => {
    t.match(er, poop)
    t.end()
  })
})

t.test('mtime cache', async t => {
  var td = {
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  }

  let mtimeCache

  var check = (file, t) => {
    var c = spawn('tar', ['tf', file])
    var out = []
    c.stdout.on('data', chunk => out.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0)
      t.equal(signal, null)
      var actual = Buffer.concat(out).toString().trim().split(/\r?\n/)
      t.same(actual, [
        '1024-bytes.txt',
        '512-bytes.txt',
        'one-byte.txt',
        'zero-byte.txt',
        path.basename(__filename),
      ])
      var mtc = {}
      mtimeCache.forEach((v, k) => mtc[k] = mtimeCache.get(k).toISOString())
      t.same(mtc, {
        '1024-bytes.txt': '2017-04-10T16:57:47.000Z',
        '512-bytes.txt': '2017-04-10T17:08:55.000Z',
        'one-byte.txt': '2017-04-10T16:58:20.000Z',
        'zero-byte.txt': '2017-04-10T17:08:01.000Z',
      })
      t.end()
    })
  }

  t.test('sync', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    r({
      sync: true,
      file,
      cwd: __dirname,
      mtimeCache: mtimeCache = new Map(),
    }, [path.basename(__filename)])
    check(file, t)
  })

  t.test('async cb', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    r({
      file,
      cwd: __dirname,
      mtimeCache: mtimeCache = new Map(),
    }, [path.basename(__filename)], er => {
      if (er) {
        throw er
      }
      check(file, t)
    })
  })

  t.test('async promise', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    r({
      file,
      cwd: __dirname,
      mtimeCache: mtimeCache = new Map(),
    }, [path.basename(__filename)]).then(_ => check(file, t))
  })

  t.end()
})

t.test('create tarball out of another tarball', t => {
  var td = {
    'out.tar': fs.readFileSync(path.resolve(tars, 'dir.tar')),
  }

  var check = (out, t) => {
    var expect = [
      'dir/',
      'Ω.txt',
      '🌟.txt',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt',
    ]
    list({
      f: out,
      sync: true,
      onentry: entry => {
        t.equal(entry.path, expect.shift())
      } })
    t.same(expect, [])
    t.end()
  }

  t.test('sync', t => {
    var dir = t.testdir(td)
    var out = resolve(dir, 'out.tar')
    r({
      f: out,
      cwd: tars,
      sync: true,
    }, ['@utf8.tar'])
    check(out, t)
  })

  t.test('async cb', t => {
    var dir = t.testdir(td)
    var out = resolve(dir, 'out.tar')
    r({
      f: out,
      cwd: tars,
    }, ['@utf8.tar'], er => {
      if (er) {
        throw er
      }
      check(out, t)
    })
  })

  t.test('async', t => {
    var dir = t.testdir(td)
    var out = resolve(dir, 'out.tar')
    r({
      f: out,
      cwd: tars,
    }, ['@utf8.tar']).then(() => check(out, t))
  })

  t.end()
})

'use strict'
var t = require('tap')
var u = require('tar').update
var path = require('path')
var fs = require('fs')
var mutateFS = require('mutate-fs')

var { resolve } = require('path')
var fixtures = path.resolve(__dirname, 'fixtures')
var tars = path.resolve(fixtures, 'tars')
var zlib = require('zlib')

var spawn = require('child_process').spawn

var data = fs.readFileSync(tars + '/body-byte-counts.tar')
var dataNoNulls = data.slice(0, data.length - 1024)
var fixtureDef = {
  'body-byte-counts.tar': data,
  'no-null-eof.tar': dataNoNulls,
  'truncated-head.tar': Buffer.concat([dataNoNulls, data.slice(0, 500)]),
  'truncated-body.tar': Buffer.concat([dataNoNulls, data.slice(0, 700)]),
  'zero.tar': Buffer.from(''),
  'empty.tar': Buffer.alloc(512),
  'compressed.tgz': zlib.gzipSync(data),
}

t.test('basic file add to archive (good or truncated)', t => {
  var check = (file, t) => {
    var c = spawn('tar', ['tf', file])
    var out = []
    c.stdout.on('data', chunk => out.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0)
      t.equal(signal, null)
      var actual = Buffer.concat(out).toString().trim().split(/\r?\n/)
      t.same(actual, [
        '1024-bytes.txt',
        '512-bytes.txt',
        'one-byte.txt',
        'zero-byte.txt',
        path.basename(__filename),
      ])
      t.end()
    })
  }

  var files = [
    'body-byte-counts.tar',
    'no-null-eof.tar',
    'truncated-head.tar',
    'truncated-body.tar',
  ]
  var td = files.map(f => [f, fixtureDef[f]]).reduce((s, [k, v]) => {
    s[k] = v
    return s
  }, {})
  var fileList = [path.basename(__filename)]
  t.test('sync', t => {
    t.plan(files.length)
    var dir = t.testdir(td)
    for (var file of files) {
      t.test(file, t => {
        u({
          sync: true,
          file: resolve(dir, file),
          cwd: __dirname,
        }, fileList)
        check(resolve(dir, file), t)
      })
    }
  })

  t.test('async cb', t => {
    t.plan(files.length)
    var dir = t.testdir(td)
    for (var file of files) {
      t.test(file, t => {
        u({
          file: resolve(dir, file),
          cwd: __dirname,
        }, fileList, er => {
          if (er) {
            throw er
          }
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.test('async', t => {
    t.plan(files.length)
    var dir = t.testdir(td)
    for (var file of files) {
      t.test(file, t => {
        u({
          file: resolve(dir, file),
          cwd: __dirname,
        }, fileList).then(() => {
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.end()
})

t.test('add to empty archive', t => {
  var check = (file, t) => {
    var c = spawn('tar', ['tf', file])
    var out = []
    c.stdout.on('data', chunk => out.push(chunk))
    c.on('close', (code, signal) => {
      t.equal(code, 0)
      t.equal(signal, null)
      var actual = Buffer.concat(out).toString().trim().split(/\r?\n/)
      t.same(actual, [
        path.basename(__filename),
      ])
      t.end()
    })
  }

  var files = [
    'empty.tar',
    'zero.tar',
  ]
  var td = files.map(f => [f, fixtureDef[f]]).reduce((s, [k, v]) => {
    s[k] = v
    return s
  }, {})
  files.push('not-existing.tar')

  t.test('sync', t => {
    var dir = t.testdir(td)
    t.plan(files.length)
    for (var file of files) {
      t.test(file, t => {
        u({
          sync: true,
          file: resolve(dir, file),
          cwd: __dirname,
        }, [path.basename(__filename)])
        check(resolve(dir, file), t)
      })
    }
  })

  t.test('async cb', t => {
    var dir = t.testdir(td)
    t.plan(files.length)
    for (var file of files) {
      t.test(file, t => {
        u({
          file: resolve(dir, file),
          cwd: __dirname,
        }, [path.basename(__filename)], er => {
          if (er) {
            throw er
          }
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.test('async', async t => {
    var dir = t.testdir(td)
    t.plan(files.length)
    for (var file of files) {
      t.test(file, t => {
        u({
          file: resolve(dir, file),
          cwd: __dirname,
        }, [path.basename(__filename)]).then(() => {
          check(resolve(dir, file), t)
        })
      })
    }
  })

  t.end()
})

t.test('cannot append to gzipped archives', t => {
  var dir = t.testdir({
    'compressed.tgz': fixtureDef['compressed.tgz'],
  })
  var file = resolve(dir, 'compressed.tgz')

  var expect = new Error('cannot append to compressed archives')
  var expectT = new TypeError('cannot append to compressed archives')

  t.throws(_ => u({
    file,
    cwd: __dirname,
    gzip: true,
  }, [path.basename(__filename)]), expectT)

  t.throws(_ => u({
    file,
    cwd: __dirname,
    sync: true,
  }, [path.basename(__filename)]), expect)

  u({
    file,
    cwd: __dirname,
  }, [path.basename(__filename)], er => {
    t.match(er, expect)
    t.end()
  })
})

t.test('other throws', t => {
  t.throws(_ => u({}, ['asdf']), new TypeError('file is required'))
  t.throws(_ => u({ file: 'asdf' }, []),
    new TypeError('no files or directories specified'))
  t.end()
})

t.test('broken open', t => {
  var dir = t.testdir({
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  })
  var file = resolve(dir, 'body-byte-counts.tar')
  var poop = new Error('poop')
  t.teardown(mutateFS.fail('open', poop))
  t.throws(_ => u({ sync: true, file: file }, ['README.md']), poop)
  u({ file }, ['README.md'], er => {
    t.match(er, poop)
    t.end()
  })
})

t.test('broken fstat', t => {
  var td = {
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  }
  var poop = new Error('poop')
  t.test('sync', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    t.teardown(mutateFS.fail('fstat', poop))
    t.throws(_ => u({ sync: true, file }, ['README.md']), poop)
    t.end()
  })
  t.test('async', t => {
    var dir = t.testdir(td)
    var file = resolve(dir, 'body-byte-counts.tar')
    t.teardown(mutateFS.fail('fstat', poop))
    u({ file }, ['README.md'], async er => {
      t.match(er, poop)
      t.end()
    })
  })
  t.end()
})

t.test('broken read', t => {
  var dir = t.testdir({
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
  })
  var file = resolve(dir, 'body-byte-counts.tar')
  var poop = new Error('poop')
  t.teardown(mutateFS.fail('read', poop))
  t.throws(_ => u({ sync: true, file }, ['README.md']), poop)
  u({ file }, ['README.md'], er => {
    t.match(er, poop)
    t.end()
  })
})

t.test('do not add older file', t => {
  var dir = t.testdir({
    'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
    '1024-bytes.txt': '.'.repeat(1024),
    foo: 'foo',
  })
  var file = resolve(dir, 'body-byte-counts.tar')

  var f = resolve(dir, '1024-bytes.txt')
  var oldDate = new Date('1997-04-10T16:57:47.000Z')
  fs.utimesSync(f, oldDate, oldDate)

  // file size should not change
  var expect = fixtureDef['body-byte-counts.tar'].length
  var check = t => {
    t.equal(fs.statSync(file).size, expect)
    t.end()
  }

  t.test('sync', t => {
    u({
      mtimeCache: new Map(),
      file,
      cwd: dir,
      sync: true,
      filter: path => path === '1024-bytes.txt',
    }, ['1024-bytes.txt', 'foo'])
    check(t)
  })

  t.test('async', t => {
    u({ file, cwd: dir }, ['1024-bytes.txt']).then(_ => check(t))
  })

  t.test('async cb', t => {
    u({ file, cwd: dir }, ['1024-bytes.txt'], er => {
      if (er) {
        throw er
      }
      check(t)
    })
  })

  t.end()
})

t.test('do add newer file', t => {
  var setup = t => {
    var dir = t.testdir({
      'body-byte-counts.tar': fixtureDef['body-byte-counts.tar'],
      '1024-bytes.txt': '.'.repeat(1024),
      foo: 'foo',
    })

    var f = resolve(dir, '1024-bytes.txt')
    var newDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    fs.utimesSync(f, newDate, newDate)
    return dir
  }

  // a chunk for the header, then 2 for the body
  var expect = fixtureDef['body-byte-counts.tar'].length + 512 + 1024
  var check = (file, t) => {
    t.equal(fs.statSync(file).size, expect)
    t.end()
  }

  t.test('sync', t => {
    var dir = setup(t)
    var file = resolve(dir, 'body-byte-counts.tar')
    u({
      mtimeCache: new Map(),
      file,
      cwd: dir,
      sync: true,
      filter: path => path === '1024-bytes.txt',
    }, ['1024-bytes.txt', 'foo'])
    check(file, t)
  })

  t.test('async', t => {
    var dir = setup(t)
    var file = resolve(dir, 'body-byte-counts.tar')
    u({ file, cwd: dir }, ['1024-bytes.txt']).then(_ => check(file, t))
  })

  t.test('async cb', t => {
    var dir = setup(t)
    var file = resolve(dir, 'body-byte-counts.tar')
    u({ file, cwd: dir }, ['1024-bytes.txt'], er => {
      if (er) {
        throw er
      }
      check(file, t)
    })
  })

  t.end()
})

'use strict'

process.umask(0o022)

var Unpack = require('tar').Unpack
var UnpackSync = Unpack.Sync
var t = require('tap')
var MiniPass = require('minipass')

var makeTar = require('./make-tar.js')
var Header = require('tar').header
var z = require('minizlib')
var fs = require('fs')
var path = require('path')
var fixtures = path.resolve(__dirname, 'fixtures')
var tars = path.resolve(fixtures, 'tars')
var parses = path.resolve(fixtures, 'parse')
var unpackdir = path.resolve(fixtures, 'unpack')
var { promisify } = require('util')
var rimraf = promisify(require('rimraf'))
var mkdirp = require('mkdirp')
var mutateFS = require('mutate-fs')
var eos = require('end-of-stream')
var normPath = require('./normalize-windows-path.js')

// On Windows in particular, the "really deep folder path" file
// often tends to cause problems, which don't indicate a failure
// of this library, it's just what happens on Windows with super
// long file paths.
var isWindows = process.platform === 'win32'
var isLongFile = f => f.match(/r.e.a.l.l.y.-.d.e.e.p.-.f.o.l.d.e.r.-.p.a.t.h/)

// t.teardown(_ => rimraf(unpackdir))

// t.before(async () => {
//   await rimraf(unpackdir)
//   await mkdirp(unpackdir)
// })

t.test('basic file unpack tests', t => {
  var basedir = path.resolve(unpackdir, 'basic')
  t.teardown(_ => rimraf(basedir))

  var cases = {
    'emptypax.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'one-byte.txt': 'a',
    },
    'body-byte-counts.tar': {
      '1024-bytes.txt': new Array(1024).join('x') + '\n',
      '512-bytes.txt': new Array(512).join('x') + '\n',
      'one-byte.txt': 'a',
      'zero-byte.txt': '',
    },
    'utf8.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'Ω.txt': 'Ω',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': 'Ω',
    },
    'file.tar': {
      'one-byte.txt': 'a',
    },
    'global-header.tar': {
      'one-byte.txt': 'a',
    },
    'long-pax.tar': {
      '120-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    },
    'long-paths.tar': {
      '100-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      '120-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      '170-byte-filename-cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/a.txt': 'short\n',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': 'Ω',
    },
  }

  var tarfiles = Object.keys(cases)
  t.plan(tarfiles.length)
  t.jobs = tarfiles.length

  tarfiles.forEach(tarfile => {
    t.test(tarfile, t => {
      var tf = path.resolve(tars, tarfile)
      var dir = path.resolve(basedir, tarfile)
      var linkdir = path.resolve(basedir, tarfile + '.link')
      t.beforeEach(async () => {
        await rimraf(dir)
        await rimraf(linkdir)
        await mkdirp(dir)
        fs.symlinkSync(dir, linkdir, 'junction')
      })

      var check = t => {
        var expect = cases[tarfile]
        Object.keys(expect).forEach(file => {
          var f = path.resolve(dir, file)
          if (isWindows && isLongFile(file)) {
            return
          }
          t.equal(fs.readFileSync(f, 'utf8'), expect[file], file)
        })
        t.end()
      }

      t.plan(2)

      t.test('async unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new Unpack({ cwd: linkdir, strict: true })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
        t.test('loose', t => {
          var unpack = new Unpack({ cwd: linkdir })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
      })

      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new UnpackSync({ cwd: linkdir })
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
        t.test('loose', t => {
          var unpack = new UnpackSync({ cwd: linkdir })
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
      })
    })
  })
})

t.test('cwd default to process cwd', t => {
  var u = new Unpack()
  var us = new UnpackSync()
  var cwd = normPath(process.cwd())
  t.equal(u.cwd, cwd)
  t.equal(us.cwd, cwd)
  t.end()
})

t.test('links!', t => {
  var dir = path.resolve(unpackdir, 'links')
  var data = fs.readFileSync(tars + '/links.tar')
  var stripData = fs.readFileSync(tars + '/links-strip.tar')

  t.plan(6)
  t.beforeEach(() => mkdirp(dir))
  t.afterEach(() => rimraf(dir))

  var check = t => {
    var hl1 = fs.lstatSync(dir + '/hardlink-1')
    var hl2 = fs.lstatSync(dir + '/hardlink-2')
    t.equal(hl1.dev, hl2.dev)
    t.equal(hl1.ino, hl2.ino)
    t.equal(hl1.nlink, 2)
    t.equal(hl2.nlink, 2)
    if (!isWindows) {
      // doesn't work on win32 without special privs
      var sym = fs.lstatSync(dir + '/symlink')
      t.ok(sym.isSymbolicLink())
      t.equal(fs.readlinkSync(dir + '/symlink'), 'hardlink-2')
    }
    t.end()
  }
  var checkForStrip = t => {
    var hl1 = fs.lstatSync(dir + '/hardlink-1')
    var hl2 = fs.lstatSync(dir + '/hardlink-2')
    var hl3 = fs.lstatSync(dir + '/1/2/3/hardlink-3')
    t.equal(hl1.dev, hl2.dev)
    t.equal(hl1.ino, hl2.ino)
    t.equal(hl1.dev, hl3.dev)
    t.equal(hl1.ino, hl3.ino)
    t.equal(hl1.nlink, 3)
    t.equal(hl2.nlink, 3)
    if (!isWindows) {
      var sym = fs.lstatSync(dir + '/symlink')
      t.ok(sym.isSymbolicLink())
      t.equal(fs.readlinkSync(dir + '/symlink'), 'hardlink-2')
    }
    t.end()
  }
  var checkForStrip3 = t => {
    // strips the linkpath entirely, so the link doesn't get extracted.
    t.throws(() => fs.lstatSync(dir + '/3'), { code: 'ENOENT' })
    t.end()
  }

  t.test('async', t => {
    var unpack = new Unpack({ cwd: dir })
    let finished = false
    unpack.on('finish', _ => finished = true)
    unpack.on('close', _ => t.ok(finished, 'emitted finish before close'))
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  t.test('sync', t => {
    var unpack = new UnpackSync({ cwd: dir })
    unpack.end(data)
    check(t)
  })

  t.test('sync strip', t => {
    var unpack = new UnpackSync({ cwd: dir, strip: 1 })
    unpack.end(stripData)
    checkForStrip(t)
  })

  t.test('async strip', t => {
    var unpack = new Unpack({ cwd: dir, strip: 1 })
    let finished = false
    unpack.on('finish', _ => finished = true)
    unpack.on('close', _ => t.ok(finished, 'emitted finish before close'))
    unpack.on('close', _ => checkForStrip(t))
    unpack.end(stripData)
  })

  t.test('sync strip 3', t => {
    var unpack = new UnpackSync({ cwd: dir, strip: 3 })
    unpack.end(fs.readFileSync(tars + '/links-strip.tar'))
    checkForStrip3(t)
  })

  t.test('async strip 3', t => {
    var unpack = new Unpack({ cwd: dir, strip: 3 })
    let finished = false
    unpack.on('finish', _ => finished = true)
    unpack.on('close', _ => t.ok(finished, 'emitted finish before close'))
    unpack.on('close', _ => checkForStrip3(t))
    unpack.end(stripData)
  })
})

t.test('links without cleanup (exercise clobbering code)', t => {
  var dir = path.resolve(unpackdir, 'links')
  var data = fs.readFileSync(tars + '/links.tar')

  t.plan(6)
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))

  t.beforeEach(() => {
    // clobber this junk
    try {
      mkdirp.sync(dir + '/hardlink-1')
      mkdirp.sync(dir + '/hardlink-2')
      fs.writeFileSync(dir + '/symlink', 'not a symlink')
    } catch (er) {}
  })

  var check = t => {
    var hl1 = fs.lstatSync(dir + '/hardlink-1')
    var hl2 = fs.lstatSync(dir + '/hardlink-2')
    t.equal(hl1.dev, hl2.dev)
    t.equal(hl1.ino, hl2.ino)
    t.equal(hl1.nlink, 2)
    t.equal(hl2.nlink, 2)
    if (!isWindows) {
      var sym = fs.lstatSync(dir + '/symlink')
      t.ok(sym.isSymbolicLink())
      t.equal(fs.readlinkSync(dir + '/symlink'), 'hardlink-2')
    }
    t.end()
  }

  t.test('async', t => {
    var unpack = new Unpack({ cwd: dir })
    let prefinished = false
    unpack.on('prefinish', _ => prefinished = true)
    unpack.on('finish', _ =>
      t.ok(prefinished, 'emitted prefinish before finish'))
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  t.test('sync', t => {
    var unpack = new UnpackSync({ cwd: dir })
    unpack.end(data)
    check(t)
  })

  t.test('async again', t => {
    var unpack = new Unpack({ cwd: dir })
    eos(unpack, _ => check(t))
    unpack.end(data)
  })

  t.test('sync again', t => {
    var unpack = new UnpackSync({ cwd: dir })
    unpack.end(data)
    check(t)
  })

  t.test('async unlink', t => {
    var unpack = new Unpack({ cwd: dir, unlink: true })
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  t.test('sync unlink', t => {
    var unpack = new UnpackSync({ cwd: dir, unlink: true })
    unpack.end(data)
    check(t)
  })
})

t.test('nested dir dupe', t => {
  var dir = path.resolve(unpackdir, 'nested-dir')
  mkdirp.sync(dir + '/d/e/e/p')
  t.teardown(_ => rimraf(dir))
  var expect = {
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/a.txt': 'short\n',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc': 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    'd/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': 'Ω',
  }

  var check = t => {
    var entries = fs.readdirSync(dir)
    t.equal(entries.length, 1)
    t.equal(entries[0], 'd')
    Object.keys(expect).forEach(f => {
      var file = dir + '/' + f
      t.equal(fs.readFileSync(file, 'utf8'), expect[f])
    })
    t.end()
  }

  var unpack = new Unpack({ cwd: dir, strip: 8 })
  var data = fs.readFileSync(tars + '/long-paths.tar')
  // while we're at it, why not use gzip too?
  var zip = new z.Gzip()
  zip.pipe(unpack)
  unpack.on('close', _ => check(t))
  zip.end(data)
})

t.test('symlink in dir path', {
  skip: isWindows && 'symlinks not fully supported',
}, t => {
  var dir = path.resolve(unpackdir, 'symlink-junk')

  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var data = makeTar([
    {
      path: 'd/i',
      type: 'Directory',
    },
    {
      path: 'd/i/r/dir',
      type: 'Directory',
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    {
      path: 'd/i/r/link',
      type: 'Link',
      linkpath: 'd/i/r/file',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/symlink',
      type: 'SymbolicLink',
      linkpath: './dir',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/symlink/x',
      type: 'File',
      size: 0,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  t.test('no clobbering', t => {
    var warnings = []
    var u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
    })
    u.on('close', _ => {
      t.equal(fs.lstatSync(dir + '/d/i').mode & 0o7777, isWindows ? 0o666 : 0o755)
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, isWindows ? 0o666 : 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      if (!isWindows) {
        t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
        t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
      }
      t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
      if (!isWindows) {
        t.equal(warnings[0][1], 'Cannot extract through symbolic link')
        t.match(warnings[0][2], {
          name: 'SylinkError',
          path: dir + '/d/i/r/symlink/',
          symlink: dir + '/d/i/r/symlink',
        })
      }
      t.equal(warnings.length, 1)
      t.end()
    })
    u.end(data)
  })

  t.test('no clobbering, sync', t => {
    var warnings = []
    var u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
    })
    u.end(data)
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, isWindows ? 0o666 : 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    if (!isWindows) {
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
      t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
    }
    t.equal(warnings.length, 1)
    t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
    t.equal(warnings[0][1], 'Cannot extract through symbolic link')
    t.match(warnings[0][2], {
      name: 'SylinkError',
      path: dir + '/d/i/r/symlink/',
      symlink: dir + '/d/i/r/symlink',
    })
    t.end()
  })

  t.test('extract through symlink', t => {
    var warnings = []
    var u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      preservePaths: true,
    })
    u.on('close', _ => {
      t.same(warnings, [])
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
      t.ok(fs.lstatSync(dir + '/d/i/r/dir/x').isFile(), 'x thru link')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
      t.end()
    })
    u.end(data)
  })

  t.test('extract through symlink sync', t => {
    var warnings = []
    var u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      preservePaths: true,
    })
    u.end(data)
    t.same(warnings, [])
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
    t.ok(fs.lstatSync(dir + '/d/i/r/dir/x').isFile(), 'x thru link')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
    t.end()
  })

  t.test('clobber through symlink', t => {
    var warnings = []
    var u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      unlink: true,
    })
    u.on('close', _ => {
      t.same(warnings, [])
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      t.notOk(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'no link')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isDirectory(), 'sym is dir')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
      t.end()
    })
    u.end(data)
  })

  t.test('clobber through symlink with busted unlink', t => {
    var poop = new Error('poop')
    t.teardown(mutateFS.fail('unlink', poop))
    var warnings = []
    var u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      unlink: true,
    })
    u.on('close', _ => {
      t.same(warnings, [['TAR_ENTRY_ERROR', 'poop', poop]])
      t.end()
    })
    u.end(data)
  })

  t.test('clobber through symlink sync', t => {
    var warnings = []
    var u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
      unlink: true,
    })
    u.end(data)
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    t.notOk(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'no link')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isDirectory(), 'sym is dir')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink/x').isFile(), 'x thru link')
    t.end()
  })

  t.test('clobber dirs', t => {
    mkdirp.sync(dir + '/d/i/r/dir')
    mkdirp.sync(dir + '/d/i/r/file')
    mkdirp.sync(dir + '/d/i/r/link')
    mkdirp.sync(dir + '/d/i/r/symlink')
    var warnings = []
    var u = new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => {
        warnings.push([c, w, d])
      },
    })
    u.on('close', _ => {
      t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
      t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
      t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
      t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
      t.equal(warnings.length, 1)
      t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
      t.equal(warnings[0][1], 'Cannot extract through symbolic link')
      t.match(warnings[0][2], {
        name: 'SylinkError',
        path: dir + '/d/i/r/symlink/',
        symlink: dir + '/d/i/r/symlink',
      })
      t.end()
    })
    u.end(data)
  })

  t.test('clobber dirs sync', t => {
    mkdirp.sync(dir + '/d/i/r/dir')
    mkdirp.sync(dir + '/d/i/r/file')
    mkdirp.sync(dir + '/d/i/r/link')
    mkdirp.sync(dir + '/d/i/r/symlink')
    var warnings = []
    var u = new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => {
        warnings.push([c, w, d])
      },
    })
    u.end(data)
    t.equal(fs.lstatSync(dir + '/d/i/r/dir').mode & 0o7777, 0o751)
    t.ok(fs.lstatSync(dir + '/d/i/r/file').isFile(), 'got file')
    t.ok(fs.lstatSync(dir + '/d/i/r/symlink').isSymbolicLink(), 'got symlink')
    t.throws(_ => fs.statSync(dir + '/d/i/r/symlink/x'))
    t.equal(warnings.length, 1)
    t.equal(warnings[0][0], 'TAR_ENTRY_ERROR')
    t.equal(warnings[0][1], 'Cannot extract through symbolic link')
    t.match(warnings[0][2], {
      name: 'SylinkError',
      path: dir + '/d/i/r/symlink/',
      symlink: dir + '/d/i/r/symlink',
    })
    t.end()
  })

  t.end()
})

t.test('unsupported entries', t => {
  var dir = path.resolve(unpackdir, 'unsupported-entries')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))
  var unknown = new Header({ path: 'qux', type: 'File', size: 4 })
  unknown.type = 'Z'
  unknown.encode()
  var data = makeTar([
    {
      path: 'dev/random',
      type: 'CharacterDevice',
    },
    {
      path: 'dev/hd0',
      type: 'BlockDevice',
    },
    {
      path: 'dev/fifo0',
      type: 'FIFO',
    },
    // note: unrecognized types are ignored, so this won't emit a warning.
    // gnutar and bsdtar treat unrecognized types as 'file', so it may be
    // worth doing the same thing, but with a warning.
    unknown.block,
    'asdf',
    '',
    '',
  ])

  t.test('basic, warns', t => {
    var warnings = []
    var u = new Unpack({ cwd: dir, onwarn: (c, w, d) => warnings.push([c, w, d]) })
    var c = 'TAR_ENTRY_UNSUPPORTED'
    var expect = [
      [c, 'unsupported entry type: CharacterDevice', {
        entry: { path: 'dev/random' } }],
      [c, 'unsupported entry type: BlockDevice', {
        entry: { path: 'dev/hd0' } }],
      [c, 'unsupported entry type: FIFO', {
        entry: { path: 'dev/fifo0' } }],
    ]
    u.on('close', _ => {
      t.equal(fs.readdirSync(dir).length, 0)
      t.match(warnings, expect)
      t.end()
    })
    u.end(data)
  })

  t.test('strict, throws', t => {
    var warnings = []
    var errors = []
    var u = new Unpack({
      cwd: dir,
      strict: true,
      onwarn: (c, w, d) => warnings.push([c, w, d]),
    })
    u.on('error', e => errors.push(e))
    u.on('close', _ => {
      t.equal(fs.readdirSync(dir).length, 0)
      t.same(warnings, [])
      t.match(errors, [
        {
          message: 'unsupported entry type: CharacterDevice',
          entry: { path: 'dev/random' },
        },
        {
          message: 'unsupported entry type: BlockDevice',
          entry: { path: 'dev/hd0' },
        },
        {
          message: 'unsupported entry type: FIFO',
          entry: { path: 'dev/fifo0' },
        },
      ])
      t.end()
    })
    u.end(data)
  })

  t.end()
})

t.test('file in dir path', t => {
  var dir = path.resolve(unpackdir, 'file-junk')

  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var data = makeTar([
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    {
      path: 'd/i/r/file/a/b/c',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'b',
    '',
    '',
  ])

  t.test('fail because of file', t => {
    var check = t => {
      t.equal(fs.readFileSync(dir + '/d/i/r/file', 'utf8'), 'a')
      t.throws(_ => fs.statSync(dir + '/d/i/r/file/a/b/c'))
      t.end()
    }

    t.plan(2)

    t.test('async', t => {
      new Unpack({ cwd: dir }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      new UnpackSync({ cwd: dir }).end(data)
      check(t)
    })
  })

  t.test('clobber on through', t => {
    var check = t => {
      t.ok(fs.statSync(dir + '/d/i/r/file').isDirectory())
      t.equal(fs.readFileSync(dir + '/d/i/r/file/a/b/c', 'utf8'), 'b')
      t.end()
    }

    t.plan(2)

    t.test('async', t => {
      new Unpack({ cwd: dir, unlink: true }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      new UnpackSync({ cwd: dir, unlink: true }).end(data)
      check(t)
    })
  })

  t.end()
})

t.test('set umask option', t => {
  var dir = path.resolve(unpackdir, 'umask')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))

  var data = makeTar([
    {
      path: 'd/i/r/dir',
      type: 'Directory',
      mode: 0o751,
    },
    '',
    '',
  ])

  new Unpack({
    umask: 0o027,
    cwd: dir,
  }).on('close', _ => {
    t.equal(fs.statSync(dir + '/d/i/r').mode & 0o7777, isWindows ? 0o666 : 0o750)
    t.equal(fs.statSync(dir + '/d/i/r/dir').mode & 0o7777, isWindows ? 0o666 : 0o751)
    t.end()
  }).end(data)
})

t.test('absolute paths', t => {
  var dir = path.join(unpackdir, 'absolute-paths')
  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var absolute = path.resolve(dir, 'd/i/r/absolute')
  var root = path.parse(absolute).root
  var extraAbsolute = root + root + root + absolute
  t.ok(path.isAbsolute(extraAbsolute))
  t.ok(path.isAbsolute(absolute))
  var parsed = path.parse(absolute)
  var relative = absolute.slice(parsed.root.length)
  t.notOk(path.isAbsolute(relative))

  var data = makeTar([
    {
      path: extraAbsolute,
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    '',
    '',
  ])

  t.test('warn and correct', t => {
    var check = t => {
      var r = normPath(root)
      t.match(warnings, [[
        `stripping ${r}${r}${r}${r} from absolute path`,
        { path: normPath(absolute), code: 'TAR_ENTRY_INFO' },
      ]])
      t.ok(fs.lstatSync(path.resolve(dir, relative)).isFile(), 'is file')
      t.end()
    }

    var warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.test('preserve absolute path', t => {
    // if we use the extraAbsolute path here, we end up creating a dir
    // like C:\C:\C:\C:\path\to\absolute, which is both 100% valid on
    // windows, as well as SUUUUUPER annoying.
    var data = makeTar([
      {
        path: isWindows ? absolute : extraAbsolute,
        type: 'File',
        size: 1,
        atime: new Date('1979-07-01T19:10:00.000Z'),
        ctime: new Date('2011-03-27T22:16:31.000Z'),
        mtime: new Date('2011-03-27T22:16:31.000Z'),
      },
      'a',
      '',
      '',
    ])
    var check = t => {
      t.same(warnings, [])
      t.ok(fs.lstatSync(absolute).isFile(), 'is file')
      t.end()
    }

    var warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        preservePaths: true,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        preservePaths: true,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.end()
})

t.test('.. paths', t => {
  var dir = path.join(unpackdir, 'dotted-paths')
  t.teardown(_ => rimraf(dir))
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var fmode = 0o755
  var dotted = 'a/b/c/../d'
  var resolved = path.resolve(dir, dotted)

  var data = makeTar([
    {
      path: dotted,
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'd',
    '',
    '',
  ])

  t.test('warn and skip', t => {
    var check = t => {
      t.match(warnings, [[
        'path contains \'..\'',
        { path: dotted, code: 'TAR_ENTRY_ERROR' },
      ]])
      t.throws(_ => fs.lstatSync(resolved))
      t.end()
    }

    var warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        fmode: fmode,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        fmode: fmode,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.test('preserve dotted path', t => {
    var check = t => {
      t.same(warnings, [])
      t.ok(fs.lstatSync(resolved).isFile(), 'is file')
      t.equal(fs.lstatSync(resolved).mode & 0o777, isWindows ? 0o666 : fmode)
      t.end()
    }

    var warnings = []

    t.test('async', t => {
      warnings.length = 0
      new Unpack({
        fmode: fmode,
        preservePaths: true,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).on('close', _ => check(t)).end(data)
    })

    t.test('sync', t => {
      warnings.length = 0
      new UnpackSync({
        fmode: fmode,
        preservePaths: true,
        cwd: dir,
        onwarn: (c, w, d) => warnings.push([w, d]),
      }).end(data)
      check(t)
    })

    t.end()
  })

  t.end()
})

t.test('fail all stats', t => {
  var poop = new Error('poop')
  poop.code = 'EPOOP'
  var dir = normPath(path.join(unpackdir, 'stat-fail'))
  var {
    stat,
    fstat,
    lstat,
    statSync,
    fstatSync,
    lstatSync,
  } = fs
  var unmutate = () => Object.assign(fs, {
    stat,
    fstat,
    lstat,
    statSync,
    fstatSync,
    lstatSync,
  })
  var mutate = () => {
    fs.stat = fs.lstat = fs.fstat = (...args) => {
      // don't fail statting the cwd, or we get different errors
      if (normPath(args[0]) === dir) {
        return lstat(dir, args.pop())
      }
      process.nextTick(() => args.pop()(poop))
    }
    fs.statSync = fs.lstatSync = fs.fstatSync = (...args) => {
      if (normPath(args[0]) === dir) {
        return lstatSync(dir)
      }
      throw poop
    }
  }

  var warnings = []
  t.beforeEach(() => {
    warnings.length = 0
    mkdirp.sync(dir)
    mutate()
  })
  t.afterEach(async () => {
    unmutate()
    await rimraf(dir)
  })

  var data = makeTar([
    {
      path: 'd/i/r/file/',
      type: 'Directory',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    {
      path: 'd/i/r/link',
      type: 'Link',
      linkpath: 'd/i/r/file',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/symlink',
      type: 'SymbolicLink',
      linkpath: './dir',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  var check = (t, expect) => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    var expect = [
      ['poop', poop],
      ['poop', poop],
    ]
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t, expect)).end(data)
  })

  t.test('sync', t => {
    var expect = [
      [
        String,
        {
          code: 'EISDIR',
          path: normPath(path.resolve(dir, 'd/i/r/file')),
          syscall: 'open',
        },
      ],
      [
        String,
        {
          dest: normPath(path.resolve(dir, 'd/i/r/link')),
          path: normPath(path.resolve(dir, 'd/i/r/file')),
          syscall: 'link',
        },
      ],
    ]
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t, expect)
  })

  t.end()
})

t.test('fail symlink', t => {
  var poop = new Error('poop')
  poop.code = 'EPOOP'
  var unmutate = mutateFS.fail('symlink', poop)
  var dir = path.join(unpackdir, 'symlink-fail')
  t.teardown(async _ => {
    unmutate()
    await rimraf(dir)
  })

  var warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    await mkdirp(dir)
  })

  var data = makeTar([
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/symlink',
      type: 'SymbolicLink',
      linkpath: './dir',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  var check = (t, expect) => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    var expect = [['poop', poop]]
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t, expect)).end(data)
  })

  t.test('sync', t => {
    var expect = [['poop', poop]]
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t, expect)
  })

  t.end()
})

t.test('fail chmod', t => {
  var poop = new Error('poop')
  poop.code = 'EPOOP'
  var unmutate = mutateFS.fail('chmod', poop)
  var dir = path.join(unpackdir, 'chmod-fail')
  t.teardown(async _ => {
    unmutate()
    await rimraf(dir)
  })

  var warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    await mkdirp(dir)
  })

  var data = makeTar([
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/dir/',
      type: 'Directory',
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  var check = (t, expect) => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    var expect = [['poop', poop]]
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t, expect)).end(data)
  })

  t.test('sync', t => {
    var expect = [['poop', poop]]
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t, expect)
  })

  t.end()
})

t.test('fail mkdir', t => {
  var poop = new Error('poop')
  poop.code = 'EPOOP'
  let unmutate
  var dir = path.join(unpackdir, 'mkdir-fail')
  t.teardown(_ => rimraf(dir))

  var warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    await mkdirp(dir)
    unmutate = mutateFS.fail('mkdir', poop)
  })
  t.afterEach(() => unmutate())

  var data = makeTar([
    {
      path: 'dir/',
      type: 'Directory',
      mode: 0o751,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '',
    '',
  ])

  var expect = [[
    'ENOENT: no such file or directory',
    {
      code: 'ENOENT',
      syscall: 'lstat',
      path: normPath(path.resolve(dir, 'dir')),
    },
  ]]

  var check = t => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t)
  })

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t)).end(data)
  })

  t.end()
})

t.test('fail write', t => {
  var poop = new Error('poop')
  poop.code = 'EPOOP'
  var unmutate = mutateFS.fail('write', poop)
  var dir = path.join(unpackdir, 'write-fail')
  t.teardown(async _ => {
    unmutate()
    await rimraf(dir)
  })

  var warnings = []
  t.beforeEach(async () => {
    warnings.length = 0
    await rimraf(dir)
    await mkdirp(dir)
  })

  var data = makeTar([
    {
      path: 'x',
      type: 'File',
      size: 1,
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'x',
    '',
    '',
  ])

  var expect = [['poop', poop]]

  var check = t => {
    t.match(warnings, expect)
    warnings.forEach(w => t.equal(w[0], w[1].message))
    t.end()
  }

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      onwarn: (c, w, d) => warnings.push([w, d]),
    }).end(data)
    check(t)
  })

  t.end()
})

t.test('skip existing', t => {
  var dir = path.join(unpackdir, 'skip-newer')
  t.teardown(_ => rimraf(dir))

  var date = new Date('2011-03-27T22:16:31.000Z')
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
    fs.writeFileSync(dir + '/x', 'y')
    fs.utimesSync(dir + '/x', date, date)
  })

  var data = makeTar([
    {
      path: 'x',
      type: 'File',
      size: 1,
      mode: 0o751,
      mtime: new Date('2013-12-19T17:00:00.000Z'),
    },
    'x',
    '',
    '',
  ])

  var check = t => {
    var st = fs.lstatSync(dir + '/x')
    t.equal(st.atime.toISOString(), date.toISOString())
    t.equal(st.mtime.toISOString(), date.toISOString())
    var data = fs.readFileSync(dir + '/x', 'utf8')
    t.equal(data, 'y')
    t.end()
  }

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      keep: true,
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      keep: true,
    }).end(data)
    check(t)
  })

  t.end()
})

t.test('skip newer', t => {
  var dir = path.join(unpackdir, 'skip-newer')
  t.teardown(_ => rimraf(dir))

  var date = new Date('2013-12-19T17:00:00.000Z')
  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
    fs.writeFileSync(dir + '/x', 'y')
    fs.utimesSync(dir + '/x', date, date)
  })

  var data = makeTar([
    {
      path: 'x',
      type: 'File',
      size: 1,
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'x',
    '',
    '',
  ])

  var check = t => {
    var st = fs.lstatSync(dir + '/x')
    t.equal(st.atime.toISOString(), date.toISOString())
    t.equal(st.mtime.toISOString(), date.toISOString())
    var data = fs.readFileSync(dir + '/x', 'utf8')
    t.equal(data, 'y')
    t.end()
  }

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      newer: true,
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      newer: true,
    }).end(data)
    check(t)
  })

  t.end()
})

t.test('no mtime', t => {
  var dir = path.join(unpackdir, 'skip-newer')
  t.teardown(_ => rimraf(dir))

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  var date = new Date('2011-03-27T22:16:31.000Z')
  var data = makeTar([
    {
      path: 'x/',
      type: 'Directory',
      size: 0,
      atime: date,
      ctime: date,
      mtime: date,
    },
    {
      path: 'x/y',
      type: 'File',
      size: 1,
      mode: 0o751,
      atime: date,
      ctime: date,
      mtime: date,
    },
    'x',
    '',
    '',
  ])

  var check = t => {
    // this may fail if it's run on March 27, 2011
    var stx = fs.lstatSync(dir + '/x')
    t.not(stx.atime.toISOString(), date.toISOString())
    t.not(stx.mtime.toISOString(), date.toISOString())
    var sty = fs.lstatSync(dir + '/x/y')
    t.not(sty.atime.toISOString(), date.toISOString())
    t.not(sty.mtime.toISOString(), date.toISOString())
    var data = fs.readFileSync(dir + '/x/y', 'utf8')
    t.equal(data, 'x')
    t.end()
  }

  t.test('async', t => {
    new Unpack({
      cwd: dir,
      noMtime: true,
    }).on('close', _ => check(t)).end(data)
  })

  t.test('sync', t => {
    new UnpackSync({
      cwd: dir,
      noMtime: true,
    }).end(data)
    check(t)
  })

  t.end()
})

t.test('unpack big enough to pause/drain', t => {
  var dir = path.resolve(unpackdir, 'drain-clog')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))
  var stream = fs.createReadStream(fixtures + '/parses.tar')
  var u = new Unpack({
    cwd: dir,
    strip: 3,
    strict: true,
  })

  u.on('ignoredEntry', entry =>
    t.fail('should not get ignored entry: ' + entry.path))

  u.on('close', _ => {
    t.pass('extraction finished')
    var actual = fs.readdirSync(dir)
    var expected = fs.readdirSync(parses)
    t.same(actual, expected)
    t.end()
  })

  stream.pipe(u)
})

t.test('set owner', t => {
  // fake it on platforms that don't have getuid
  var myUid = 501
  var myGid = 1024
  var getuid = process.getuid
  var getgid = process.getgid
  process.getuid = _ => myUid
  process.getgid = _ => myGid
  t.teardown(_ => (process.getuid = getuid, process.getgid = getgid))

  // can't actually do this because it requires root, but we can
  // verify that chown gets called.
  t.test('as root, defaults to true', t => {
    var getuid = process.getuid
    process.getuid = _ => 0
    var u = new Unpack()
    t.equal(u.preserveOwner, true, 'preserveOwner enabled')
    process.getuid = getuid
    t.end()
  })

  t.test('as non-root, defaults to false', t => {
    var getuid = process.getuid
    process.getuid = _ => 501
    var u = new Unpack()
    t.equal(u.preserveOwner, false, 'preserveOwner disabled')
    process.getuid = getuid
    t.end()
  })

  var data = makeTar([
    {
      uid: 2456124561,
      gid: 813708013,
      path: 'foo/',
      type: 'Directory',
    },
    {
      uid: myUid,
      gid: 813708013,
      path: 'foo/my-uid-different-gid',
      type: 'File',
      size: 3,
    },
    'qux',
    {
      uid: 2456124561,
      path: 'foo/different-uid-nogid',
      type: 'Directory',
    },
    {
      uid: 2456124561,
      path: 'foo/different-uid-nogid/bar',
      type: 'File',
      size: 3,
    },
    'qux',
    {
      gid: 813708013,
      path: 'foo/different-gid-nouid/bar',
      type: 'File',
      size: 3,
    },
    'qux',
    {
      uid: myUid,
      gid: myGid,
      path: 'foo-mine/',
      type: 'Directory',
    },
    {
      uid: myUid,
      gid: myGid,
      path: 'foo-mine/bar',
      type: 'File',
      size: 3,
    },
    'qux',
    {
      uid: myUid,
      path: 'foo-mine/nogid',
      type: 'Directory',
    },
    {
      uid: myUid,
      path: 'foo-mine/nogid/bar',
      type: 'File',
      size: 3,
    },
    'qux',
    '',
    '',
  ])

  t.test('chown failure results in unpack failure', t => {
    var dir = path.resolve(unpackdir, 'chown')
    var poop = new Error('expected chown failure')
    var un = mutateFS.fail('chown', poop)
    var unl = mutateFS.fail('lchown', poop)
    var unf = mutateFS.fail('fchown', poop)

    t.teardown(async () => {
      un()
      unf()
      unl()
      await rimraf(dir)
    })

    t.test('sync', t => {
      mkdirp.sync(dir)
      t.teardown(_ => rimraf(dir))
      let warned = false
      var u = new Unpack.Sync({
        cwd: dir,
        preserveOwner: true,
        onwarn: (c, m, er) => {
          if (!warned) {
            warned = true
            t.equal(er, poop)
            t.end()
          }
        },
      })
      u.end(data)
    })

    t.test('async', t => {
      mkdirp.sync(dir)
      t.teardown(_ => rimraf(dir))
      let warned = false
      var u = new Unpack({
        cwd: dir,
        preserveOwner: true,
        onwarn: (c, m, er) => {
          if (!warned) {
            warned = true
            t.equal(er, poop)
            t.end()
          }
        },
      })
      u.end(data)
    })

    t.end()
  })

  t.test('chown when true', t => {
    var dir = path.resolve(unpackdir, 'chown')
    var chown = fs.chown
    var lchown = fs.lchown
    var fchown = fs.fchown
    var chownSync = fs.chownSync
    var fchownSync = fs.fchownSync
    var lchownSync = fs.lchownSync
    let called = 0
    fs.fchown = fs.chown = fs.lchown = (path, owner, group, cb) => {
      called++
      cb()
    }
    fs.chownSync = fs.lchownSync = fs.fchownSync = _ => called++

    t.teardown(_ => {
      fs.chown = chown
      fs.fchown = fchown
      fs.lchown = lchown
      fs.chownSync = chownSync
      fs.fchownSync = fchownSync
      fs.lchownSync = lchownSync
    })

    t.test('sync', t => {
      mkdirp.sync(dir)
      t.teardown(_ => rimraf(dir))
      called = 0
      var u = new Unpack.Sync({ cwd: dir, preserveOwner: true })
      u.end(data)
      t.ok(called >= 5, 'called chowns')
      t.end()
    })

    t.test('async', t => {
      mkdirp.sync(dir)
      t.teardown(_ => rimraf(dir))
      called = 0
      var u = new Unpack({ cwd: dir, preserveOwner: true })
      u.end(data)
      u.on('close', _ => {
        t.ok(called >= 5, 'called chowns')
        t.end()
      })
    })

    t.end()
  })

  t.test('no chown when false', t => {
    var dir = path.resolve(unpackdir, 'nochown')
    var poop = new Error('poop')
    var un = mutateFS.fail('chown', poop)
    var unf = mutateFS.fail('fchown', poop)
    var unl = mutateFS.fail('lchown', poop)
    t.teardown(async _ => {
      un()
      unf()
      unl()
      await rimraf(dir)
    })

    t.beforeEach(() => mkdirp(dir))
    t.afterEach(() => rimraf(dir))

    var check = t => {
      var dirStat = fs.statSync(dir + '/foo')
      t.not(dirStat.uid, 2456124561)
      t.not(dirStat.gid, 813708013)
      var fileStat = fs.statSync(dir + '/foo/my-uid-different-gid')
      t.not(fileStat.uid, 2456124561)
      t.not(fileStat.gid, 813708013)
      var dirStat2 = fs.statSync(dir + '/foo/different-uid-nogid')
      t.not(dirStat2.uid, 2456124561)
      var fileStat2 = fs.statSync(dir + '/foo/different-uid-nogid/bar')
      t.not(fileStat2.uid, 2456124561)
      t.end()
    }

    t.test('sync', t => {
      var u = new Unpack.Sync({ cwd: dir, preserveOwner: false })
      u.end(data)
      check(t)
    })

    t.test('async', t => {
      var u = new Unpack({ cwd: dir, preserveOwner: false })
      u.end(data)
      u.on('close', _ => check(t))
    })

    t.end()
  })

  t.end()
})

t.test('unpack when dir is not writable', t => {
  var data = makeTar([
    {
      path: 'a/',
      type: 'Directory',
      mode: 0o444,
    },
    {
      path: 'a/b',
      type: 'File',
      size: 1,
    },
    'a',
    '',
    '',
  ])

  var dir = path.resolve(unpackdir, 'nowrite-dir')
  t.beforeEach(() => mkdirp(dir))
  t.afterEach(() => rimraf(dir))

  var check = t => {
    t.equal(fs.statSync(dir + '/a').mode & 0o7777, isWindows ? 0o666 : 0o744)
    t.equal(fs.readFileSync(dir + '/a/b', 'utf8'), 'a')
    t.end()
  }

  t.test('sync', t => {
    var u = new Unpack.Sync({ cwd: dir, strict: true })
    u.end(data)
    check(t)
  })

  t.test('async', t => {
    var u = new Unpack({ cwd: dir, strict: true })
    u.end(data)
    u.on('close', _ => check(t))
  })

  t.end()
})

t.test('transmute chars on windows', t => {
  var data = makeTar([
    {
      path: '<|>?:.txt',
      size: 5,
      type: 'File',
    },
    '<|>?:',
    '',
    '',
  ])

  var dir = path.resolve(unpackdir, 'winchars')
  t.beforeEach(() => mkdirp(dir))
  t.afterEach(() => rimraf(dir))

  var hex = 'ef80bcef81bcef80beef80bfef80ba2e747874'
  var uglyName = Buffer.from(hex, 'hex').toString()
  var ugly = path.resolve(dir, uglyName)

  var check = t => {
    t.same(fs.readdirSync(dir), [uglyName])
    t.equal(fs.readFileSync(ugly, 'utf8'), '<|>?:')
    t.end()
  }

  t.test('async', t => {
    var u = new Unpack({
      cwd: dir,
      win32: true,
    })
    u.end(data)
    u.on('close', _ => check(t))
  })

  t.test('sync', t => {
    var u = new Unpack.Sync({
      cwd: dir,
      win32: true,
    })
    u.end(data)
    check(t)
  })

  t.end()
})

t.test('safely transmute chars on windows with absolutes', t => {
  // don't actually make the directory
  var poop = new Error('poop')
  t.teardown(mutateFS.fail('mkdir', poop))

  var data = makeTar([
    {
      path: 'c:/x/y/z/<|>?:.txt',
      size: 5,
      type: 'File',
    },
    '<|>?:',
    '',
    '',
  ])

  var hex = 'ef80bcef81bcef80beef80bfef80ba2e747874'
  var uglyName = Buffer.from(hex, 'hex').toString()
  var uglyPath = 'c:/x/y/z/' + uglyName

  var u = new Unpack({
    win32: true,
    preservePaths: true,
  })
  u.on('entry', entry => {
    t.equal(entry.path, uglyPath)
    t.end()
  })

  u.end(data)
})

t.test('use explicit chmod when required by umask', t => {
  process.umask(0o022)

  var basedir = path.resolve(unpackdir, 'umask-chmod')

  var data = makeTar([
    {
      path: 'x/y/z',
      mode: 0o775,
      type: 'Directory',
    },
    '',
    '',
  ])

  var check = async t => {
    var st = fs.statSync(basedir + '/x/y/z')
    t.equal(st.mode & 0o777, isWindows ? 0o666 : 0o775)
    await rimraf(basedir)
    t.end()
  }

  t.test('async', t => {
    mkdirp.sync(basedir)
    var unpack = new Unpack({ cwd: basedir })
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  return t.test('sync', t => {
    mkdirp.sync(basedir)
    var unpack = new Unpack.Sync({ cwd: basedir })
    unpack.end(data)
    check(t)
  })
})

t.test('dont use explicit chmod if noChmod flag set', t => {
  process.umask(0o022)
  var { umask } = process
  t.teardown(() => process.umask = umask)
  process.umask = () => {
    throw new Error('should not call process.umask()')
  }

  var basedir = path.resolve(unpackdir, 'umask-no-chmod')

  var data = makeTar([
    {
      path: 'x/y/z',
      mode: 0o775,
      type: 'Directory',
    },
    '',
    '',
  ])

  var check = async t => {
    var st = fs.statSync(basedir + '/x/y/z')
    t.equal(st.mode & 0o777, isWindows ? 0o666 : 0o755)
    await rimraf(basedir)
    t.end()
  }

  t.test('async', t => {
    mkdirp.sync(basedir)
    var unpack = new Unpack({ cwd: basedir, noChmod: true })
    unpack.on('close', _ => check(t))
    unpack.end(data)
  })

  return t.test('sync', t => {
    mkdirp.sync(basedir)
    var unpack = new Unpack.Sync({ cwd: basedir, noChmod: true })
    unpack.end(data)
    check(t)
  })
})

t.test('chown implicit dirs and also the entries', t => {
  var basedir = path.resolve(unpackdir, 'chownr')

  // club these so that the test can run as non-root
  var chown = fs.chown
  var chownSync = fs.chownSync
  var lchown = fs.lchown
  var lchownSync = fs.lchownSync
  var fchown = fs.fchown
  var fchownSync = fs.fchownSync

  var getuid = process.getuid
  var getgid = process.getgid
  t.teardown(_ => {
    fs.chown = chown
    fs.chownSync = chownSync
    fs.lchown = lchown
    fs.lchownSync = lchownSync
    fs.fchown = fchown
    fs.fchownSync = fchownSync
    process.getgid = getgid
  })

  let chowns = 0

  let currentTest = null
  fs.lchown = fs.fchown = fs.chown = (path, uid, gid, cb) => {
    currentTest.equal(uid, 420, 'chown(' + path + ') uid')
    currentTest.equal(gid, 666, 'chown(' + path + ') gid')
    chowns++
    cb()
  }

  fs.lchownSync = fs.chownSync = fs.fchownSync = (path, uid, gid) => {
    currentTest.equal(uid, 420, 'chownSync(' + path + ') uid')
    currentTest.equal(gid, 666, 'chownSync(' + path + ') gid')
    chowns++
  }

  var data = makeTar([
    {
      path: 'a/b/c',
      mode: 0o775,
      type: 'File',
      size: 1,
      uid: null,
      gid: null,
    },
    '.',
    {
      path: 'x/y/z',
      mode: 0o775,
      uid: 12345,
      gid: 54321,
      type: 'File',
      size: 1,
    },
    '.',
    '',
    '',
  ])

  var check = async t => {
    currentTest = null
    t.equal(chowns, 8)
    chowns = 0
    await rimraf(basedir)
    t.end()
  }

  t.test('throws when setting uid/gid improperly', t => {
    t.throws(_ => new Unpack({ uid: 420 }),
      TypeError('cannot set owner without number uid and gid'))
    t.throws(_ => new Unpack({ gid: 666 }),
      TypeError('cannot set owner without number uid and gid'))
    t.throws(_ => new Unpack({ uid: 1, gid: 2, preserveOwner: true }),
      TypeError('cannot preserve owner in archive and also set owner explicitly'))
    t.end()
  })

  var tests = () =>
    t.test('async', t => {
      currentTest = t
      mkdirp.sync(basedir)
      var unpack = new Unpack({ cwd: basedir, uid: 420, gid: 666 })
      unpack.on('close', _ => check(t))
      unpack.end(data)
    }).then(t.test('sync', t => {
      currentTest = t
      mkdirp.sync(basedir)
      var unpack = new Unpack.Sync({ cwd: basedir, uid: 420, gid: 666 })
      unpack.end(data)
      check(t)
    }))

  tests()

  t.test('make it look like processUid is 420', t => {
    process.getuid = () => 420
    t.end()
  })

  tests()

  t.test('make it look like processGid is 666', t => {
    process.getuid = getuid
    process.getgid = () => 666
    t.end()
  })

  return tests()
})

t.test('bad cwd setting', t => {
  var basedir = path.resolve(unpackdir, 'bad-cwd')
  mkdirp.sync(basedir)
  t.teardown(_ => rimraf(basedir))

  var cases = [
    // the cwd itself
    {
      path: './',
      type: 'Directory',
    },
    // a file directly in the cwd
    {
      path: 'a',
      type: 'File',
    },
    // a file nested within a subdir of the cwd
    {
      path: 'a/b/c',
      type: 'File',
    },
  ]

  fs.writeFileSync(basedir + '/file', 'xyz')

  cases.forEach(c => t.test(c.type + ' ' + c.path, t => {
    var data = makeTar([
      {
        path: c.path,
        mode: 0o775,
        type: c.type,
        size: 0,
        uid: null,
        gid: null,
      },
      '',
      '',
    ])

    t.test('cwd is a file', t => {
      var cwd = basedir + '/file'
      var opt = { cwd: cwd }

      t.throws(_ => new Unpack.Sync(opt).end(data), {
        name: 'CwdError',
        message: 'ENOTDIR: Cannot cd into \'' + normPath(cwd) + '\'',
        path: normPath(cwd),
        code: 'ENOTDIR',
      })

      new Unpack(opt).on('error', er => {
        t.match(er, {
          name: 'CwdError',
          message: 'ENOTDIR: Cannot cd into \'' + normPath(cwd) + '\'',
          path: normPath(cwd),
          code: 'ENOTDIR',
        })
        t.end()
      }).end(data)
    })

    return t.test('cwd is missing', t => {
      var cwd = basedir + '/asdf/asdf/asdf'
      var opt = { cwd: cwd }

      t.throws(_ => new Unpack.Sync(opt).end(data), {
        name: 'CwdError',
        message: 'ENOENT: Cannot cd into \'' + normPath(cwd) + '\'',
        path: normPath(cwd),
        code: 'ENOENT',
      })

      new Unpack(opt).on('error', er => {
        t.match(er, {
          name: 'CwdError',
          message: 'ENOENT: Cannot cd into \'' + normPath(cwd) + '\'',
          path: normPath(cwd),
          code: 'ENOENT',
        })
        t.end()
      }).end(data)
    })
  }))

  t.end()
})

t.test('transform', t => {
  var basedir = path.resolve(unpackdir, 'transform')
  t.teardown(_ => rimraf(basedir))

  var cases = {
    'emptypax.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'one-byte.txt': '[a]',
    },
    'body-byte-counts.tar': {
      '1024-bytes.txt': new Array(1024).join('[x]') + '[\n]',
      '512-bytes.txt': new Array(512).join('[x]') + '[\n]',
      'one-byte.txt': '[a]',
      'zero-byte.txt': '',
    },
    'utf8.tar': {
      '🌟.txt': '🌟✧✩⭐︎✪✫✬✭✮⚝✯✰✵✶✷✸✹❂⭑⭒★☆✡☪✴︎✦✡️🔯✴️🌠\n',
      'Ω.txt': '[Ω]',
      'long-path/r/e/a/l/l/y/-/d/e/e/p/-/f/o/l/d/e/r/-/p/a/t/h/Ω.txt': '[Ω]',
    },
  }

  var txFn = entry => {
    switch (path.basename(entry.path)) {
      case 'zero-bytes.txt':
        return entry

      case 'one-byte.txt':
      case '1024-bytes.txt':
      case '512-bytes.txt':
      case 'Ω.txt':
        return new Bracer()
    }
  }

  class Bracer extends MiniPass {
    write (data) {
      var d = data.toString().split('').map(c => '[' + c + ']').join('')
      return super.write(d)
    }
  }

  var tarfiles = Object.keys(cases)
  t.plan(tarfiles.length)
  t.jobs = tarfiles.length

  tarfiles.forEach(tarfile => {
    t.test(tarfile, t => {
      var tf = path.resolve(tars, tarfile)
      var dir = path.resolve(basedir, tarfile)
      t.beforeEach(async () => {
        await rimraf(dir)
        await mkdirp(dir)
      })

      var check = t => {
        var expect = cases[tarfile]
        Object.keys(expect).forEach(file => {
          var f = path.resolve(dir, file)
          t.equal(fs.readFileSync(f, 'utf8'), expect[file], file)
        })
        t.end()
      }

      t.plan(2)

      t.test('async unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new Unpack({ cwd: dir, strict: true, transform: txFn })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
        t.test('loose', t => {
          var unpack = new Unpack({ cwd: dir, transform: txFn })
          fs.createReadStream(tf).pipe(unpack)
          eos(unpack, _ => check(t))
        })
      })

      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new UnpackSync({ cwd: dir, strict: true, transform: txFn })
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
        t.test('loose', t => {
          var unpack = new UnpackSync({ cwd: dir, transform: txFn })
          unpack.end(fs.readFileSync(tf))
          check(t)
        })
      })
    })
  })
})

t.test('transform error', t => {
  var dir = path.resolve(unpackdir, 'transform-error')
  mkdirp.sync(dir)
  t.teardown(_ => rimraf(dir))

  var tarfile = path.resolve(tars, 'body-byte-counts.tar')
  var tardata = fs.readFileSync(tarfile)
  var poop = new Error('poop')

  var txFn = () => {
    var tx = new MiniPass()
    tx.write = () => tx.emit('error', poop)
    tx.resume()
    return tx
  }

  t.test('sync unpack', t => {
    t.test('strict', t => {
      var unpack = new UnpackSync({ cwd: dir, strict: true, transform: txFn })
      var expect = 3
      let actual = 0
      unpack.on('error', er => {
        t.equal(er, poop)
        actual++
      })
      unpack.end(tardata)
      t.equal(actual, expect, 'error count')
      t.end()
    })
    t.test('loose', t => {
      var unpack = new UnpackSync({ cwd: dir, transform: txFn })
      var expect = 3
      let actual = 0
      unpack.on('warn', (code, msg, er) => {
        t.equal(er, poop)
        actual++
      })
      unpack.end(tardata)
      t.equal(actual, expect, 'error count')
      t.end()
    })
    t.end()
  })
  t.test('async unpack', t => {
    // the last error is about the folder being deleted, just ignore that one
    t.test('strict', t => {
      var unpack = new Unpack({ cwd: dir, strict: true, transform: txFn })
      t.plan(3)
      t.teardown(() => {
        unpack.removeAllListeners('error')
        unpack.on('error', () => {})
      })
      unpack.on('error', er => t.equal(er, poop))
      unpack.end(tardata)
    })
    t.test('loose', t => {
      var unpack = new Unpack({ cwd: dir, transform: txFn })
      t.plan(3)
      t.teardown(() => unpack.removeAllListeners('warn'))
      unpack.on('warn', (code, msg, er) => t.equal(er, poop))
      unpack.end(tardata)
    })
    t.end()
  })

  t.end()
})

t.test('futimes/fchown failures', t => {
  var archive = path.resolve(tars, 'utf8.tar')
  var dir = path.resolve(unpackdir, 'futimes-fchown-fails')
  var tardata = fs.readFileSync(archive)

  var poop = new Error('poop')
  var second = new Error('second error')

  t.beforeEach(async () => {
    await rimraf(dir)
    await mkdirp(dir)
  })

  t.teardown(() => rimraf(dir))

  var methods = ['utimes', 'chown']
  methods.forEach(method => {
    var fc = method === 'chown'
    t.test(method + ' fallback', t => {
      t.teardown(mutateFS.fail('f' + method, poop))
      // forceChown will fail on systems where the user is not root
      // and/or the uid/gid in the archive aren't valid. We're just
      // verifying coverage here, so make the method auto-pass.
      t.teardown(mutateFS.pass(method))
      t.plan(2)
      t.test('async unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new Unpack({ cwd: dir, strict: true, forceChown: fc })
          unpack.on('finish', t.end)
          unpack.end(tardata)
        })
        t.test('loose', t => {
          var unpack = new Unpack({ cwd: dir, forceChown: fc })
          unpack.on('finish', t.end)
          unpack.on('warn', t.fail)
          unpack.end(tardata)
        })
      })
      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new Unpack.Sync({ cwd: dir, strict: true, forceChown: fc })
          unpack.end(tardata)
          t.end()
        })
        t.test('loose', t => {
          var unpack = new Unpack.Sync({ cwd: dir, forceChown: fc })
          unpack.on('warn', t.fail)
          unpack.end(tardata)
          t.end()
        })
      })
    })

    t.test('also fail ' + method, t => {
      var unmutate = mutateFS.fail('f' + method, poop)
      var unmutate2 = mutateFS.fail(method, second)
      t.teardown(() => {
        unmutate()
        unmutate2()
      })
      t.plan(2)
      t.test('async unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new Unpack({ cwd: dir, strict: true, forceChown: fc })
          t.plan(3)
          unpack.on('error', er => t.equal(er, poop))
          unpack.end(tardata)
        })
        t.test('loose', t => {
          var unpack = new Unpack({ cwd: dir, forceChown: fc })
          t.plan(3)
          unpack.on('warn', (code, m, er) => t.equal(er, poop))
          unpack.end(tardata)
        })
      })
      t.test('sync unpack', t => {
        t.plan(2)
        t.test('strict', t => {
          var unpack = new Unpack.Sync({ cwd: dir, strict: true, forceChown: fc })
          t.plan(3)
          unpack.on('error', er => t.equal(er, poop))
          unpack.end(tardata)
        })
        t.test('loose', t => {
          var unpack = new Unpack.Sync({ cwd: dir, forceChown: fc })
          t.plan(3)
          unpack.on('warn', (c, m, er) => t.equal(er, poop))
          unpack.end(tardata)
        })
      })
    })
  })

  t.end()
})

t.test('onentry option is preserved', t => {
  var basedir = path.resolve(unpackdir, 'onentry-method')
  mkdirp.sync(basedir)
  t.teardown(() => rimraf(basedir))

  let oecalls = 0
  var onentry = entry => oecalls++
  var data = makeTar([
    {
      path: 'd/i',
      type: 'Directory',
    },
    {
      path: 'd/i/r/dir',
      type: 'Directory',
      mode: 0o751,
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    {
      path: 'd/i/r/file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    '',
    '',
  ])

  var check = t => {
    t.equal(oecalls, 3)
    oecalls = 0
    t.end()
  }

  t.test('sync', t => {
    var dir = path.join(basedir, 'sync')
    mkdirp.sync(dir)
    var unpack = new UnpackSync({ cwd: dir, onentry })
    unpack.end(data)
    check(t)
  })

  t.test('async', t => {
    var dir = path.join(basedir, 'async')
    mkdirp.sync(dir)
    var unpack = new Unpack({ cwd: dir, onentry })
    unpack.on('finish', () => check(t))
    unpack.end(data)
  })

  t.end()
})

t.test('do not reuse hardlinks, only nlink=1 files', t => {
  var basedir = path.resolve(unpackdir, 'hardlink-reuse')
  mkdirp.sync(basedir)
  t.teardown(() => rimraf(basedir))

  var now = new Date('2018-04-30T18:30:39.025Z')

  var data = makeTar([
    {
      path: 'overwriteme',
      type: 'File',
      size: 4,
      mode: 0o644,
      mtime: now,
    },
    'foo\n',
    {
      path: 'link',
      linkpath: 'overwriteme',
      type: 'Link',
      mode: 0o644,
      mtime: now,
    },
    {
      path: 'link',
      type: 'File',
      size: 4,
      mode: 0o644,
      mtime: now,
    },
    'bar\n',
    '',
    '',
  ])

  var checks = {
    link: 'bar\n',
    overwriteme: 'foo\n',
  }

  var check = t => {
    for (var f in checks) {
      t.equal(fs.readFileSync(basedir + '/' + f, 'utf8'), checks[f], f)
      t.equal(fs.statSync(basedir + '/' + f).nlink, 1, f)
    }
    t.end()
  }

  t.test('async', t => {
    var u = new Unpack({ cwd: basedir })
    u.on('close', () => check(t))
    u.end(data)
  })

  t.test('sync', t => {
    var u = new UnpackSync({ cwd: basedir })
    u.end(data)
    check(t)
  })

  t.end()
})

t.test('trying to unpack a non-zlib gzip file should fail', t => {
  var data = Buffer.from('hello this is not gzip data')
  var dataGzip = Buffer.concat([Buffer.from([0x1f, 0x8b]), data])
  var basedir = path.resolve(unpackdir, 'bad-archive')
  t.test('abort if gzip has an error', t => {
    t.plan(2)
    var expect = {
      message: /^zlib/,
      errno: Number,
      code: /^Z/,
      recoverable: false,
      cwd: normPath(basedir),
      tarCode: 'TAR_ABORT',
    }
    var opts = {
      cwd: basedir,
      gzip: true,
    }
    new Unpack(opts)
      .once('error', er => t.match(er, expect, 'async emits'))
      .end(dataGzip)
    var skip = !/^v([0-9]|1[0-3])\./.test(process.version) ? false
      : 'node prior to v14 did not raise sync zlib errors properly'
    t.throws(() => new UnpackSync(opts).end(dataGzip),
      expect, 'sync throws', { skip })
  })

  t.test('bad archive if no gzip', t => {
    t.plan(2)
    var expect = {
      tarCode: 'TAR_BAD_ARCHIVE',
      recoverable: false,
    }
    var opts = { cwd: basedir }
    new Unpack(opts)
      .on('error', er => t.match(er, expect, 'async emits'))
      .end(data)
    t.throws(() => new UnpackSync(opts).end(data), expect, 'sync throws')
  })

  t.end()
})

t.test('handle errors on fs.close', t => {
  var poop = new Error('poop')
  var { close, closeSync } = fs
  // have to actually close them, or else windows gets mad
  fs.close = (fd, cb) => close(fd, () => cb(poop))
  fs.closeSync = (fd) => {
    closeSync(fd)
    throw poop
  }
  t.teardown(() => Object.assign(fs, { close, closeSync }))
  var dir = path.resolve(unpackdir, 'close-fail')
  mkdirp.sync(dir + '/sync')
  mkdirp.sync(dir + '/async')
  var data = makeTar([
    {
      path: 'file',
      type: 'File',
      size: 1,
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    'a',
    '',
    '',
  ])

  t.plan(2)
  new Unpack({ cwd: dir + '/async', strict: true })
    .on('error', er => t.equal(er, poop, 'async'))
    .end(data)
  t.throws(() => new UnpackSync({
    cwd: normPath(dir + '/sync'), strict: true,
  }).end(data), poop, 'sync')
})

t.test('drop entry from dirCache if no longer a directory', {
  skip: isWindows && 'symlinks not fully supported',
}, t => {
  var dir = path.resolve(unpackdir, 'dir-cache-error')
  mkdirp.sync(dir + '/sync/y')
  mkdirp.sync(dir + '/async/y')
  var data = makeTar([
    {
      path: 'x',
      type: 'Directory',
    },
    {
      path: 'x',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    {
      path: 'x/ginkoid',
      type: 'File',
      size: 'ginkoid'.length,
    },
    'ginkoid',
    '',
    '',
  ])
  t.plan(2)
  var WARNINGS = {}
  var check = (t, path) => {
    t.equal(fs.statSync(path + '/x').isDirectory(), true)
    t.equal(fs.lstatSync(path + '/x').isSymbolicLink(), true)
    t.equal(fs.statSync(path + '/y').isDirectory(), true)
    t.strictSame(fs.readdirSync(path + '/y'), [])
    t.throws(() => fs.readFileSync(path + '/x/ginkoid'), { code: 'ENOENT' })
    t.strictSame(WARNINGS[path], [
      'TAR_ENTRY_ERROR',
      'Cannot extract through symbolic link',
    ])
    t.end()
  }
  t.test('async', t => {
    var path = dir + '/async'
    new Unpack({ cwd: path })
      .on('warn', (code, msg) => WARNINGS[path] = [code, msg])
      .on('end', () => check(t, path))
      .end(data)
  })
  t.test('sync', t => {
    var path = dir + '/sync'
    new UnpackSync({ cwd: path })
      .on('warn', (code, msg) => WARNINGS[path] = [code, msg])
      .end(data)
    check(t, path)
  })
})

t.test('using strip option when top level file exists', t => {
  var dir = path.resolve(unpackdir, 'strip-with-top-file')
  mkdirp.sync(dir + '/sync/y')
  mkdirp.sync(dir + '/async/y')
  var data = makeTar([
    {
      path: 'top',
      type: 'File',
      size: 0,
    },
    {
      path: 'x',
      type: 'Directory',
    },
    {
      path: 'x/a',
      type: 'File',
      size: 'a'.length,
    },
    'a',
    {
      path: 'y',
      type: 'GNUDumpDir',
    },
    {
      path: 'y/b',
      type: 'File',
      size: 'b'.length,
    },
    'b',
    '',
    '',
  ])
  t.plan(2)
  var check = (t, path) => {
    t.equal(fs.statSync(path).isDirectory(), true)
    t.equal(fs.readFileSync(path + '/a', 'utf8'), 'a')
    t.equal(fs.readFileSync(path + '/b', 'utf8'), 'b')
    t.throws(() => fs.statSync(path + '/top'), { code: 'ENOENT' })
    t.end()
  }
  t.test('async', t => {
    var path = dir + '/async'
    new Unpack({ cwd: path, strip: 1 })
      .on('end', () => check(t, path))
      .end(data)
  })
  t.test('sync', t => {
    var path = dir + '/sync'
    new UnpackSync({ cwd: path, strip: 1 }).end(data)
    check(t, path)
  })
})

t.test('handle EPERMs when creating symlinks', t => {
  // https://github.com/npm/node-tar/issues/265
  var msg = 'You do not have sufficient privilege to perform this operation.'
  var er = Object.assign(new Error(msg), {
    code: 'EPERM',
  })
  t.teardown(mutateFS.fail('symlink', er))
  var data = makeTar([
    {
      path: 'x',
      type: 'Directory',
    },
    {
      path: 'x/y',
      type: 'File',
      size: 'hello, world'.length,
    },
    'hello, world',
    {
      path: 'x/link1',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    {
      path: 'x/link2',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    {
      path: 'x/link3',
      type: 'SymbolicLink',
      linkpath: './y',
    },
    {
      path: 'x/z',
      type: 'File',
      size: 'hello, world'.length,
    },
    'hello, world',
    '',
    '',
  ])

  var dir = path.resolve(unpackdir, 'eperm-symlinks')
  mkdirp.sync(`${dir}/sync`)
  mkdirp.sync(`${dir}/async`)

  var check = path => {
    t.match(WARNINGS, [
      ['TAR_ENTRY_ERROR', msg],
      ['TAR_ENTRY_ERROR', msg],
      ['TAR_ENTRY_ERROR', msg],
    ], 'got expected warnings')
    t.equal(WARNINGS.length, 3)
    WARNINGS.length = 0
    t.equal(fs.readFileSync(`${path}/x/y`, 'utf8'), 'hello, world')
    t.equal(fs.readFileSync(`${path}/x/z`, 'utf8'), 'hello, world')
    t.throws(() => fs.statSync(`${path}/x/link1`), { code: 'ENOENT' })
    t.throws(() => fs.statSync(`${path}/x/link2`), { code: 'ENOENT' })
    t.throws(() => fs.statSync(`${path}/x/link3`), { code: 'ENOENT' })
  }

  var WARNINGS = []
  var u = new Unpack({
    cwd: `${dir}/async`,
    onwarn: (code, msg, er) => WARNINGS.push([code, msg]),
  })
  u.on('end', () => {
    check(`${dir}/async`)
    var u = new UnpackSync({
      cwd: `${dir}/sync`,
      onwarn: (code, msg, er) => WARNINGS.push([code, msg]),
    })
    u.end(data)
    check(`${dir}/sync`)
    t.end()
  })
  u.end(data)
})

t.test('close fd when error writing', t => {
  var data = makeTar([
    {
      type: 'Directory',
      path: 'x',
    },
    {
      type: 'File',
      size: 1,
      path: 'x/y',
    },
    '.',
    '',
    '',
  ])
  t.teardown(mutateFS.fail('write', new Error('nope')))
  var CLOSES = []
  var OPENS = {}
  var { open } = require('fs')
  t.teardown(() => fs.open = open)
  fs.open = (...args) => {
    var cb = args.pop()
    args.push((er, fd) => {
      OPENS[args[0]] = fd
      cb(er, fd)
    })
    return open.call(fs, ...args)
  }
  t.teardown(mutateFS.mutateArgs('close', ([fd]) => {
    CLOSES.push(fd)
    return [fd]
  }))
  var WARNINGS = []
  var dir = path.resolve(unpackdir, 'close-on-write-error')
  mkdirp.sync(dir)
  var unpack = new Unpack({
    cwd: dir,
    onwarn: (code, msg) => WARNINGS.push([code, msg]),
  })
  unpack.on('end', () => {
    for (var [path, fd] of Object.entries(OPENS)) {
      t.equal(CLOSES.includes(fd), true, 'closed fd for ' + path)
    }
    t.end()
  })
  unpack.end(data)
})

t.test('close fd when error setting mtime', t => {
  var data = makeTar([
    {
      type: 'Directory',
      path: 'x',
    },
    {
      type: 'File',
      size: 1,
      path: 'x/y',
      atime: new Date('1979-07-01T19:10:00.000Z'),
      ctime: new Date('2011-03-27T22:16:31.000Z'),
      mtime: new Date('2011-03-27T22:16:31.000Z'),
    },
    '.',
    '',
    '',
  ])
  // have to clobber these both, because we fall back
  t.teardown(mutateFS.fail('futimes', new Error('nope')))
  t.teardown(mutateFS.fail('utimes', new Error('nooooope')))
  var CLOSES = []
  var OPENS = {}
  var { open } = require('fs')
  t.teardown(() => fs.open = open)
  fs.open = (...args) => {
    var cb = args.pop()
    args.push((er, fd) => {
      OPENS[args[0]] = fd
      cb(er, fd)
    })
    return open.call(fs, ...args)
  }
  t.teardown(mutateFS.mutateArgs('close', ([fd]) => {
    CLOSES.push(fd)
    return [fd]
  }))
  var WARNINGS = []
  var dir = path.resolve(unpackdir, 'close-on-futimes-error')
  mkdirp.sync(dir)
  var unpack = new Unpack({
    cwd: dir,
    onwarn: (code, msg) => WARNINGS.push([code, msg]),
  })
  unpack.on('end', () => {
    for (var [path, fd] of Object.entries(OPENS)) {
      t.equal(CLOSES.includes(fd), true, 'closed fd for ' + path)
    }
    t.end()
  })
  unpack.end(data)
})

t.test('do not hang on large files that fail to open()', t => {
  var data = makeTar([
    {
      type: 'Directory',
      path: 'x',
    },
    {
      type: 'File',
      size: 31745,
      path: 'x/y',
    },
    'x'.repeat(31745),
    '',
    '',
  ])
  t.teardown(mutateFS.fail('open', new Error('nope')))
  var dir = path.resolve(unpackdir, 'no-hang-for-large-file-failures')
  mkdirp.sync(dir)
  var WARNINGS = []
  var unpack = new Unpack({
    cwd: dir,
    onwarn: (code, msg) => WARNINGS.push([code, msg]),
  })
  unpack.on('end', () => {
    t.strictSame(WARNINGS, [['TAR_ENTRY_ERROR', 'nope']])
    t.end()
  })
  unpack.write(data.slice(0, 2048))
  setTimeout(() => {
    unpack.write(data.slice(2048, 4096))
    setTimeout(() => {
      unpack.write(data.slice(4096))
      setTimeout(() => {
        unpack.end()
      })
    })
  })
})

t.test('dirCache pruning unicode normalized collisions', {
  skip: isWindows && 'symlinks not fully supported',
}, t => {
  var data = makeTar([
    {
      type: 'Directory',
      path: 'foo',
    },
    {
      type: 'File',
      path: 'foo/bar',
      size: 1,
    },
    'x',
    {
      type: 'Directory',
      // café
      path: Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString(),
    },
    {
      type: 'SymbolicLink',
      // cafe with a `
      path: Buffer.from([0x63, 0x61, 0x66, 0x65, 0xcc, 0x81]).toString(),
      linkpath: 'foo',
    },
    {
      type: 'Directory',
      path: 'foo',
    },
    {
      type: 'File',
      path: Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString() + '/bar',
      size: 1,
    },
    'y',
    '',
    '',
  ])

  var check = (path, dirCache, t) => {
    path = path.replace(/\\/g, '/')
    t.strictSame([...dirCache.entries()][0], [`${path}/foo`, true])
    t.equal(fs.readFileSync(path + '/foo/bar', 'utf8'), 'x')
    t.end()
  }

  t.test('sync', t => {
    var path = t.testdir()
    var dirCache = new Map()
    new UnpackSync({ cwd: path, dirCache }).end(data)
    check(path, dirCache, t)
  })
  t.test('async', t => {
    var path = t.testdir()
    var dirCache = new Map()
    new Unpack({ cwd: path, dirCache })
      .on('close', () => check(path, dirCache, t))
      .end(data)
  })

  t.end()
})

t.test('dircache prune all on windows when symlink encountered', t => {
  if (process.platform !== 'win32') {
    process.env.TESTING_TAR_FAKE_PLATFORM = 'win32'
    t.teardown(() => {
      delete process.env.TESTING_TAR_FAKE_PLATFORM
    })
  }
  var symlinks = []
  var Unpack = t.mock('../lib/unpack.js', {
    fs: {
      ...fs,
      symlink: (target, dest, cb) => {
        symlinks.push(['async', target, dest])
        process.nextTick(cb)
      },
      symlinkSync: (target, dest) => symlinks.push(['sync', target, dest]),
    },
  })
  var UnpackSync = Unpack.Sync

  var data = makeTar([
    {
      type: 'Directory',
      path: 'foo',
    },
    {
      type: 'File',
      path: 'foo/bar',
      size: 1,
    },
    'x',
    {
      type: 'Directory',
      // café
      path: Buffer.from([0x63, 0x61, 0x66, 0xc3, 0xa9]).toString(),
    },
    {
      type: 'SymbolicLink',
      // cafe with a `
      path: Buffer.from([0x63, 0x61, 0x66, 0x65, 0xcc, 0x81]).toString(),
      linkpath: 'safe/actually/but/cannot/be/too/careful',
    },
    {
      type: 'File',
      path: 'bar/baz',
      size: 1,
    },
    'z',
    '',
    '',
  ])

  var check = (path, dirCache, t) => {
    // symlink blew away all dirCache entries before it
    path = path.replace(/\\/g, '/')
    t.strictSame([...dirCache.entries()], [
      [`${path}/bar`, true],
    ])
    t.equal(fs.readFileSync(`${path}/foo/bar`, 'utf8'), 'x')
    t.equal(fs.readFileSync(`${path}/bar/baz`, 'utf8'), 'z')
    t.end()
  }

  t.test('sync', t => {
    var path = t.testdir()
    var dirCache = new Map()
    new UnpackSync({ cwd: path, dirCache }).end(data)
    check(path, dirCache, t)
  })

  t.test('async', t => {
    var path = t.testdir()
    var dirCache = new Map()
    new Unpack({ cwd: path, dirCache })
      .on('close', () => check(path, dirCache, t))
      .end(data)
  })

  t.end()
})

t.test('recognize C:.. as a dot path part', t => {
  if (process.platform !== 'win32') {
    process.env.TESTING_TAR_FAKE_PLATFORM = 'win32'
    t.teardown(() => {
      delete process.env.TESTING_TAR_FAKE_PLATFORM
    })
  }
  var Unpack = t.mock('../lib/unpack.js', {
    path: {
      ...path.win32,
      win32: path.win32,
      posix: path.posix,
    },
  })
  var UnpackSync = Unpack.Sync

  var data = makeTar([
    {
      type: 'File',
      path: 'C:../x/y/z',
      size: 1,
    },
    'z',
    {
      type: 'File',
      path: 'x:..\\y\\z',
      size: 1,
    },
    'x',
    {
      type: 'File',
      path: 'Y:foo',
      size: 1,
    },
    'y',
    '',
    '',
  ])

  var check = (path, warnings, t) => {
    t.equal(fs.readFileSync(`${path}/foo`, 'utf8'), 'y')
    t.strictSame(warnings, [
      [
        'TAR_ENTRY_ERROR',
        "path contains '..'",
        'C:../x/y/z',
        'C:../x/y/z',
      ],
      ['TAR_ENTRY_ERROR', "path contains '..'", 'x:../y/z', 'x:../y/z'],
      [
        'TAR_ENTRY_INFO',
        'stripping Y: from absolute path',
        'Y:foo',
        'foo',
      ],
    ])
    t.end()
  }

  t.test('async', t => {
    var warnings = []
    var path = t.testdir()
    new Unpack({
      cwd: path,
      onwarn: (c, w, { entry, path }) => warnings.push([c, w, path, entry.path]),
    })
      .on('close', () => check(path, warnings, t))
      .end(data)
  })

  t.test('sync', t => {
    var warnings = []
    var path = t.testdir()
    new UnpackSync({
      cwd: path,
      onwarn: (c, w, { entry, path }) => warnings.push([c, w, path, entry.path]),
    }).end(data)
    check(path, warnings, t)
  })

  t.end()
})
