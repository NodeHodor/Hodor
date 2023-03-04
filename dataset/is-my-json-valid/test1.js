var validator = require('is-my-json-valid')

var validate = validator({
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
})

console.log('should be valid', validate({hello: 'world'}))
console.log('should not be valid', validate({}))

// get the last list of errors by checking validate.errors
// the following will print [{field: 'data.hello', message: 'is required'}]
console.log(validate.errors)


var validate = validator({
  type: 'string',
  required: true,
  format: 'only-a'
}, {
  formats: {
    'only-a': /^a+$/
  }
})

console.log(validate('aa')) // true
console.log(validate('ab')) // false

var ext = {
  required: true,
  type: 'string'
}

var schema = {
  $ref: '#ext' // references another schema called ext
}

// pass the external schemas as an option
var validate = validator(schema, {schemas: {ext: ext}})

validate('hello') // returns true
validate(42) // return false

var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]

var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]

var validate = validator({
  type: 'object',
  properties: {
    x: {
      type: 'number'
    }
  },
  required: ['x', 'y']
}, {
  greedy: true
});

validate({x: 'string'});
console.log(validate.errors) // [{field: 'data.y', message: 'is required'},
                             //  {field: 'data.x', message: 'is the wrong type'}]

                             var validate = validator({
  type: 'string',
  required: true,
  format: 'only-a'
}, {
  formats: {
    'only-a': /^a+$/
  }
})

console.log(validate('aa')) // true
console.log(validate('ab')) // false


var validate = validator({
  type: 'string',
  required: true,
  format: 'only-a'
}, {
  formats: {
    'only-a': /^a+$/
  }
})

console.log(validate('aa')) // true
console.log(validate('ab')) // false


var ext = {
  required: true,
  type: 'string'
}

var schema = {
  $ref: '#ext' // references another schema called ext
}

// pass the external schemas as an option
var validate = validator(schema, {schemas: {ext: ext}})

validate('hello') // returns true
validate(42) // return false


var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]

var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]

var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]


var filter = validator.filter({
  required: true,
  type: 'object',
  properties: {
    hello: {type: 'string', required: true}
  },
  additionalProperties: false
})

var doc = {hello: 'world', notInSchema: true}
console.log(filter(doc)) // {hello: 'world'}

var schema = {
  required: true,
  type: 'object',
  properties: {
    hello: {
      required: true,
      type: 'string'
    }
  }
}
var validate = validator(schema, {
  verbose: true
})

validate({hello: 100});
console.log(validate.errors)
// [ { field: 'data.hello',
//     message: 'is the wrong type',
//     value: 100,
//     type: 'string',
//     schemaPath: [ 'properties', 'hello' ] } ]

var schemaPath = validate.errors[0].schemaPath
var R = require('ramda')

console.log( 'All evaluate to the same thing: ', R.equals(
  schema.properties.hello,
  { required: true, type: 'string' },
  R.path(schemaPath, schema),
  require('lodash').get(schema, schemaPath),
  require('jsonpointer').get(schema, [""].concat(schemaPath))
))
// All evaluate to the same thing: true

var validate = validator({
  type: 'object',
  properties: {
    x: {
      type: 'number'
    }
  },
  required: ['x', 'y']
}, {
  greedy: true
});

validate({x: 'string'});
console.log(validate.errors) // [{field: 'data.y', message: 'is required'},
                             //  {field: 'data.x', message: 'is the wrong type'}]

var tape = require('tape')
var fs = require('fs')
var validator = require('is-my-json-valid')

var files = fs.readdirSync(__dirname+'/json-schema-draft4')
  .map(function(file) {
    if (file === 'definitions.json') return null
    if (file === 'refRemote.json') return null
    return require('./json-schema-draft4/'+file)
  })
  .filter(Boolean)

files.forEach(function(file) {
  file.forEach(function(f) {
    tape('json-schema-test-suite '+f.description, function(t) {
      var validate = validator(f.schema)
      f.tests.forEach(function(test) {
        t.same(validate(test.data), test.valid, test.description)
      })
      t.end()
    })
  })
})
