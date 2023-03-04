const mask = require("mongoosemask");

mask(['privateField', '_id'])

mask.mask({}, [
  '',
]);

mask.expose(
    'publicField',
    'data.privateField',
    {'data.publicField': 'data.public'},
    {'nestedDoc.publicField.nested.error': 'nested'}
);

mask.mask(['_id', 'privateField']);