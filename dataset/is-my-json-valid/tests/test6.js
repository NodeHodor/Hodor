var validator = require('is-my-json-valid')
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
