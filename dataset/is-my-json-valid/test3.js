var validator = require('is-my-json-valid')

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
