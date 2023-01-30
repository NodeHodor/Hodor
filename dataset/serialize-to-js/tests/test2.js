var serialize = require('serialize-to-js').serialize
var obj = { object: { regexp: /^test?$/ } };
obj.reference = obj.object;
var opts = { reference: true };
console.log(serialize(obj, opts));
//> {object: {regexp: /^test?$/}}
console.log(opts.references);
//> [ [ '.reference', '.object' ] ]
