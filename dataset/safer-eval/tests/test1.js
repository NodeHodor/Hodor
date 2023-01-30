'use strict' //< NEVER FORGET TO ADD STRICT MODE in file/ function
             //< running `saferEval`
const saferEval = require('safer-eval')
const code = `{d: new Date('1970-01-01'), b: new Buffer('data')}`
const res = saferEval(code)
// => toString.call(res.d) = '[object Date]'
// => toString.call(res.b) = '[object Buffer]'
