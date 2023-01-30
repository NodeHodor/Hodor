var validator = require('is-my-json-valid')

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
