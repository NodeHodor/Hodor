const serialize = require('serialize-to-js').serialize;
const obj = {
  str: '<script>var a = 0 > 1</script>',
  num: 3.1415,
  bool: true,
  nil: null,
  undef: undefined,
  obj: { foo: 'bar' },
  arr: [1, '2'],
  regexp: /^test?$/,
  date: new Date(),
  buffer: new Buffer('data'),
  set: new Set([1, 2, 3]),
  // map: new Map([['a': 1],['b': 2]])
}
console.log(serialize(obj))
//> '{str: "\u003Cscript\u003Evar a = 0 \u003E 1\u003C\u002Fscript\u003E",
//>   num: 3.1415, bool: true, nil: null, undef: undefined,
//>   obj: {foo: "bar"}, arr: [1, "2"], regexp: new RegExp("^test?$", ""),
//>   date: new Date("2019-12-29T10:37:36.613Z"),
//>   buffer: Buffer.from("ZGF0YQ==", "base64"), set: new Set([1, 2, 3]),
//>   map: new Map([["a", 1], ["b", 2]])}'
