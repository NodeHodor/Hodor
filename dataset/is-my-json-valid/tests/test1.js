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
