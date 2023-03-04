var djv = require('djv');
var env = new djv();
var jsonSchema = {
  "common": {
    "properties": {
      "type": {
        "enum": ["common"]
      }
    },
    "required": [
      "type"
    ]
  }
};

// Use `addSchema` to add json-schema
env.addSchema('test', jsonSchema);
env.validate('test#/common', { type: 'common' });
// => undefined

env.validate('test#/common', { type: 'custom' });
// => 'required: data'

var djv = require('djv');
var env = djv({
  version: 'draft-06', // use json-schema draft-06
  formats: { /*...*/ }, // custom formats @see #addFormat
  errorHandler: () => { /*...*/ }, // custom error handler, @see #setErrorHandler
});

var env = new djv({ version: 'draft-04' });

env.addSchema('test', jsonSchema);

env.validate('test#/common', { type: 'common' });
// => undefined

env.validate('test#/common', { type: 'custom' });
// => 'required: data'

env.removeSchema('test#/common');

env.resolve('test');
// => { name: 'test', schema: {} }, fn: ... }

env.export();
// => { test: { name: 'test', schema: {}, ... } }

// env.import(config);

env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
// or
env.addFormat('isOk', function(schema, tpl){
  return `!${schema.isOk}`;
});
// env.validate('ok', 'valid') // => undefined if schema contains isOk property

function defaultErrorHandler(errorType) {
    return `return "${errorType}: ${tpl.data}";`;
  }

djv({ errorHandler: () => 'return { error: true };' }) // => returns an object
djv({
errorHandler(type) {
    return `errors.push({
    type: '${type}',
    schema: '${this.schema[this.schema.length - 1]}',
    data: '${this.data[this.data.length - 1]}'
    });`;
}
});

env.useVersion('draft-04')
// or
env.useVersion('custom')



