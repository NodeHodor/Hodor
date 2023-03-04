var morgan = require('morgan')

morgan('tiny')

morgan(':method :url :status :res[content-length] - :response-time ms')

morgan('immediate')

morgan(':method :url :status :res[content-length] - :response-time ms')

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
})

morgan('common', {
  skip: function (req, res) { return res.statusCode < 400 }
})

morgan('short')
morgan(':method :url :status :res[content-length] - :response-time ms')

morgan('dev')
morgan(':method :url :status :res[content-length] - :response-time ms')


var split = require('split')
var http = require('http')
var fs = require('fs')
var request = require('supertest')
var join = require('path').join
var https = require('https')

function createLineStream (callback) {
  return split().on('data', callback)
}

function createServer (format, opts, fn, fn1) {
  return http.createServer()
    .on('request', createRequestListener(format, opts, fn, fn1))
}

function createRequestListener (format, opts, fn, fn1) {
  var logger = morgan(format, opts)
  var middle = fn || noopMiddleware

  return function onRequest (req, res) {
    // prior alterations
    if (fn1) {
      fn1(req, res)
    }

    logger(req, res, function onNext (err) {
      // allow req, res alterations
      middle(req, res, function onDone () {
        if (err) {
          res.statusCode = 500
          res.end(err.message)
        }

        res.setHeader('X-Sent', 'true')
        res.end((req.connection && req.connection.remoteAddress) || '-')
      })
    })
  }
}

function noopMiddleware (req, res, next) {
  next()
}

function createSecureServer (format, opts, fn, fn1) {
  var cert = fs.readFileSync(join(__dirname, 'fixtures', 'server.crt'), 'ascii')
  var key = fs.readFileSync(join(__dirname, 'fixtures', 'server.key'), 'ascii')

  return https.createServer({ cert: cert, key: key })
    .on('request', createRequestListener(format, opts, fn, fn1))
}

var cb = function (err, res, line) {
  // if (err) return done(err)
  // assert(/^GET \/ 200 - - \d+\.\d{3} ms$/.test(line))
  // done()
}

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer('tiny', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':method :url', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

function format (tokens, req, res) {
  return [req.method, req.url, res.statusCode].join(' ')
}

request(createServer(format, { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer({ stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer({ format: ':method :url', stream: stream }))
  .get('/')
  .expect(200, cb)


var stream = createLineStream(function (line) {
  cb(null, null, line)
})

function format () {
  return 'apple'
}

request(createServer({ format: format, stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

Object.defineProperty(process, 'stdout', {
  value: stream
})

request(createServer(undefined, { stream: undefined }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(undefined, { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':date', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':date[clf]', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':date[iso]', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':date[web]', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':date[bogus]', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':http-version', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':req[x-from-string]', { stream: stream }))
  .get('/')
  .set('x-from-string', 'me')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':req[set-cookie]', { stream: stream }))
  .get('/')
  .set('Set-Cookie', ['foo=bar', 'fizz=buzz'])
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':res[x-sent]', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

var server = createServer(':res[x-keys]', { stream: stream }, function (req, res, next) {
  res.setHeader('X-Keys', ['foo', 'bar'])
  next()
})

request(server)
  .get('/')
  .expect('X-Keys', 'foo, bar')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':remote-addr', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

var server = createServer(':remote-addr', { stream: stream }, null, function (req) {
  req.ip = '10.0.0.1'
})

request(server)
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

var server = createSecureServer(':remote-addr', { stream: stream })

request(server)
  .get('/')
  .ca(server.cert)
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':remote-addr', { stream: stream }))
  .get('/')
  .set('Connection', 'close')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

// var server = createServer(':remote-addr', { stream: stream }, function (req, res, next) {
//   delete req._remoteAddress
//   next()
// })

// request(server.listen())
//   .get('/')
//   .set('Connection', 'keep-alive')
//   .expect(200, cb)

// var stream = createLineStream(function (line) {
//   cb(null, null, line)
// })

// var server = createServer(':remote-addr', { stream: stream }, null, function (req) {
//   delete req.connection
// })

// request(server.listen())
//   .get('/')
//   .set('Connection', 'keep-alive')
//   .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':remote-user', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':remote-user', { stream: stream }))
  .get('/')
  .set('Authorization', 'Basic dGo6')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':remote-user', { stream: stream }))
  .get('/')
  .set('Authorization', 'Basic Og==')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

var start = Date.now()

request(createServer(':response-time', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':response-time', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':status', { stream: stream }))
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

var server = createServer(':status', {
  immediate: true,
  stream: stream
})

request(server)
  .get('/')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  assert.strictEqual(line, '-')
  server.close(done)
})

// var server = createServer(':status', { stream: stream }, function () {
//   test.abort()
// })

// var test = request(server).post('/')
// test.write('0')



var stream = createLineStream(function (line) {
  cb(null, null, line)
})

request(createServer(':url', { stream: stream }))
  .get('/foo')
  .expect(200, cb)

var stream = createLineStream(function (line) {
  cb(null, null, line)
})

var server = createServer(':url', { stream: stream }, function (req, res, next) {
  req.originalUrl = '/bar'
  next()
})

request(server)
  .get('/')
  .expect(200, cb)