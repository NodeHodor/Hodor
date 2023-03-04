var validator = require('is-my-json-valid')

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
