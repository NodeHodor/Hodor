'use strict';


var assert = require('assert');
var yaml = require('js-yaml');

yaml.load(`foo: !!str bar`);

var data = yaml.load(`
! 12
`);

var data = yaml.load(`
---
xmas: 2011-12-24
...
`);

var data = yaml.load(`
test: >
  a
  b
  c
`);

// previously parsed as int
yaml.load('1:23');
// previously parsed as float
yaml.load('1:23.45');

yaml.load('01234');
yaml.load('00999');
yaml.load('-00999');
yaml.load('001234.56');
yaml.load('001234e4');
yaml.load('-001234.56');
yaml.load('-001234e4');

yaml.load('0o1234');
// not valid octal
yaml.load('0o1289');

yaml.dump(123);

var tests = '1:23 1:23.45';

tests.split(' ').forEach(function (sample) {
    yaml.dump(sample);
});

var tests = '1:23 1:23.45';

tests.split(' ').forEach(function (sample) {
    yaml.dump(sample);
});

var source = `
foo: {bar}
`;

yaml.load(source);

var src = `
date1: 2010-10-20T20:45:00Z
date2: 2010-10-20T20:45:00+01:00
`;
var data = yaml.load(src), date1, date2;

date1 = data.date1; // date1: 2010-10-20T20:45:00Z
date1.getUTCFullYear();
date1.getUTCMonth();
date1.getUTCDate();
date1.getUTCHours();
date1.getUTCMinutes();
date1.getUTCSeconds();

date2 = data.date2; // date2: 2010-10-20T20:45:00+0100
date2.getUTCFullYear();
date2.getUTCMonth();
date2.getUTCDate();
date2.getUTCHours();
date2.getUTCMinutes();
date2.getUTCSeconds();


var data = yaml.load(`
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
- ууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу
`);


var sources = [
    'text:\n    hello\n  world',   // plain style
    "text:\n    'hello\n  world'", // single-quoted style
    'text:\n    "hello\n  world"'  // double-quoted style
  ];
var expected = { text: 'hello world' };

yaml.load(sources[0]); 
yaml.load(sources[1]);
yaml.load(sources[2]);

yaml.load(sources[0]);
yaml.load(sources[1]);
yaml.load(sources[2]);

var readFileSync = require('fs').readFileSync;
yaml.load(readFileSync(require('path').join(__dirname, '/0064.yml'), 'utf8'));

yaml.dump({ data: [ 'foo', 'bar', 'baz' ] });
yaml.dump({ foo: { bar: [ 'baz' ] } });

yaml.load(`
 foo\t \t:\t \t1\t \t
\t \t \t
 bar \t : \t 2 \t
`)

yaml.load(`
 -\t \tfoo\t \t
\t \t \t
 - \t bar \t 
`)

yaml.load(`
\t{\tfoo\t:\t1\t,\tbar\t:\t2\t}\t
`)

yaml.load(`
\t[\tfoo\t,\tbar\t]\t
`)

yaml.load(`
foo: # string indent = 1
 \t \t1
  \t 2
 \t \t3
`)

var DEPRECATED_BOOLEANS_SYNTAX = [
    'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
    'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

DEPRECATED_BOOLEANS_SYNTAX.forEach(function (string) {
    var dump = yaml.dump(string).trim();
});

yaml.load('{ "field1" : "v1", "field2": "v2" }');

var data = yaml.load(`
first: >
  a
  b
    c
    d
  e
  f

second: >
  a
  b
    c

    d
  e
  f

third: >
  a
  b

    c
    d
  e
  f
`);

data.first;
data.second;
data.third;

yaml.load('a: |\nb: .')
yaml.load('a: |+\nb: .')
yaml.load('a: |-\nb: .')

yaml.load('a: >\nb: .')
yaml.load('a: >+\nb: .')
yaml.load('a: >-\nb: .')

yaml.load('a: |\n\nb: .')
yaml.load('a: |+\n\nb: .')
yaml.load('a: |-\n\nb: .')

yaml.load('a: >\n\nb: .')
yaml.load('a: >+\n\nb: .')
yaml.load('a: >-\n\nb: .')

yaml.load('|\n  foobar\n')
yaml.load('|\n  hello\n  world\n')
yaml.load('|\n  war never changes\n')


var source = {
    a: { a: 1 },
    b: [ 1, 2 ],
    c: {},
    d: []
};
source.crossObject = source.a;
source.crossArray = source.b;
source.c.circularObject = source;
source.d.push(source.d);
source.d.push(source);

var obtained = yaml.load(yaml.dump(source));

obtained.crossObject
obtained.crossArray
obtained.c.circularObject
obtained.d[0]
obtained.d[1]

assert.strictEqual(yaml.load('constructor'),          'constructor');
assert.deepStrictEqual(yaml.load('constructor: value'),     { constructor: 'value' });
assert.deepStrictEqual(yaml.load('key: constructor'),       { key: 'constructor' });
assert.deepStrictEqual(yaml.load('{ constructor: value }'), { constructor: 'value' });
assert.deepStrictEqual(yaml.load('{ key: constructor }'),   { key: 'constructor' });

assert.strictEqual(yaml.dump(-0), '-0.0\n');
assert.strictEqual(yaml.load('--- |\nfoo\n'), 'foo\n');

assert.doesNotThrow(function () { yaml.load("- 'hello\n\n  world'"); });
assert.doesNotThrow(function () { yaml.load('- "hello\n\n  world"'); });
assert.doesNotThrow(function () { yaml.load('- [hello,\n\n  world]'); });
assert.doesNotThrow(function () { yaml.load('- {hello: world,\n\n  foo: bar}'); });
assert.deepStrictEqual(yaml.load('---\ntest: !!null \nfoo: bar'), { test: null, foo: 'bar' });

assert.strictEqual(yaml.load('"\\U0001F431"'), '🐱');

let object = yaml.load('{ __proto__: {foo: bar} }');

assert.strictEqual(({}).hasOwnProperty.call(yaml.load('{}'), '__proto__'), false);
assert.strictEqual(({}).hasOwnProperty.call(object, '__proto__'), false);

var src = `
foo: {
    bar: true
}
`;
var warnings = [],
    data;

data = yaml.load(src);

assert.deepStrictEqual(data, { foo: { bar: true } });

yaml.load(src, { onWarning: function (e) { warnings.push(e); } });

assert.strictEqual(warnings.length, 1);


var src = `
test: |-


  Hello
  world
`;

assert.deepStrictEqual(yaml.load(src), { test: '\n\nHello\nworld' });

var obj = { test: 'canary' };
var arrayWithRefs = [ obj, obj ];

var obtained = yaml.load(yaml.dump(arrayWithRefs));

assert.strictEqual(obtained[0].test, 'canary');
assert.strictEqual(obtained[0], obtained[1]);


var array = [ 0, 1 ];
var arrayWithRefs = [ array, array ];

var obtained = yaml.load(yaml.dump(arrayWithRefs));

assert.strictEqual(obtained[0][0], 0);
assert.strictEqual(obtained[0][1], 1);
assert.strictEqual(obtained[0], obtained[1]);

assert.strictEqual(5e-100.toString(10), '5e-100');
assert.strictEqual(0.5e-100.toString(10), '5e-101');

assert.strictEqual(yaml.dump(0.5e-100), '5.e-101\n');
assert.strictEqual(yaml.load(yaml.dump(5e-100)), 5e-100);

try{
    assert.throws(function () { yaml.load('|-\nfoo\nbar'); }, yaml.YAMLException);
    assert.deepStrictEqual(yaml.dump('foo\nbar'), '|-\n  foo\nbar');
}catch(e){

}

assert.strictEqual(yaml.dump({ a: '\n' }, { flowLevel: 0 }), '{a: "\\n"}\n');
assert.strictEqual(yaml.dump({ a: '\n' }, { flowLevel: 2 }), 'a: |+\n\n');

var src = readFileSync(require('path').join(__dirname, '/0243-basic.yml'), 'utf8');
var lines = src.split('\n');

try {
    yaml.load(src);
} catch (e) {
}

var src = readFileSync(require('path').join(__dirname, '/0243-nested.yml'), 'utf8');
    var lines = src.split('\n');

try {
    yaml.load(src);
} catch (e) {
}

try {
    yaml.load('{ foo: 123, foo: 456 }');
} catch (e) {
}

try {
    yaml.load('   ? foo\n   ? foo\n   ? bar');
} catch (e) {
}

var history = [];
function l(eventType, state) {
  history.push([ eventType, state.position, state.result ]);
}

yaml.load('{ a: 1, b: [ 0, xyz ] }', { listener: l });

var i = -1;
assert.strictEqual(history[++i][0], 'open'); // doc
assert.strictEqual(history[++i][0], 'open'); // map

assert.strictEqual(history[++i][0], 'open'); // key
assert.strictEqual(history[++i][0], 'close');
assert.strictEqual(history[i][2], 'a');

assert.strictEqual(history[++i][0], 'open'); // a value
assert.strictEqual(history[++i][0], 'close');
assert.strictEqual(history[i][2], 1);

assert.strictEqual(history[++i][0], 'open'); // key
assert.strictEqual(history[++i][0], 'close');
assert.strictEqual(history[i][2], 'b');

assert.strictEqual(history[++i][0], 'open'); // b value (list)
assert.strictEqual(history[++i][0], 'open'); // item in list
assert.strictEqual(history[++i][0], 'close');
assert.strictEqual(history[i][2], 0);
assert.strictEqual(history[++i][0], 'open'); // item in list
assert.strictEqual(history[++i][0], 'close');

assert.strictEqual(history[++i][0], 'close'); // b value (list) end
assert.deepStrictEqual(history[i][2], [ 0, 'xyz' ]);

assert.strictEqual(history[++i][0], 'close'); // map end
assert.strictEqual(history[++i][0], 'close'); // doc end

assert.strictEqual(history.length, ++i);

var DEPRECATED_BOOLEANS_SYNTAX = [
    'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
    'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
  ];

DEPRECATED_BOOLEANS_SYNTAX.forEach(function (string) {
    var dump = yaml.dump(string, { noCompatMode: true }).trim();

    assert(
        (dump === string),
        ('"' + string + '" string is not dumped as-is; actual dump: ' + dump)
    );
});


try{
    assert.deepStrictEqual(
        yaml.load('foo: &a\nbar: *a\n'),
        { foo: null, bar: null }
      );
    
} catch(e) {

}

try{
    assert.deepStrictEqual(
        yaml.load('{ foo: &a, bar: *a }'),
        { foo: null, bar: null }
        );
    
} catch(e) {

}

try{
    assert.deepStrictEqual(
        yaml.load('- &a\n- *a\n'),
        [ null, null ]
        );
    
} catch(e) {

}

try{
    assert.deepStrictEqual(
        yaml.load('[ &a, *a ]'),
        [ null, null ]
        );
    
} catch(e) {

}

try{
    assert.throws(function () {
        yaml.load('[foo, bar,, baz]');
      }, /expected the node content, but found ','/);
    
    
} catch(e) {

}

try{
    assert.throws(function () {
        yaml.load('{foo, bar,, baz}');
      }, /expected the node content, but found ','/);
    
    
} catch(e) {

}


assert.deepStrictEqual(yaml.load('{foo,: bar}'), { foo: null, null: 'bar' });

try {
    yaml.load('"foo\u0001bar"');
} catch (err) {
}

try {
yaml.load('*');
} catch (err) {

}

try {
yaml.load('foo:\n  bar: 1\na');
} catch (err) {

}

var data = yaml.load(`
negative: !!float -1
zero: !!float 0
positive: !!float 2.3e4
`);

assert.deepStrictEqual(data, {
negative: -1,
zero: 0,
positive: 23000
});


try {
    assert.deepStrictEqual(
        yaml.dump(simpleArray, { indent: 1 }),
        '- a\n- b\n'
      );
} catch (err) {
}

try {
    assert.deepStrictEqual(
        yaml.dump(simpleArray, { indent: 2 }),
        '- a\n- b\n'
      );
} catch (err) {
}

try {
    assert.deepStrictEqual(
        yaml.dump(simpleArray, { indent: 3 }),
        '- a\n- b\n'
      );
} catch (err) {
}

try {
    assert.deepStrictEqual(
        yaml.dump(simpleArray, { indent: 4 }),
        '- a\n- b\n'
      );
} catch (err) {
}

try {
    assert.deepStrictEqual(
        yaml.dump(arrayOfSimpleObj, { indent: 2 }),
        '- a: 1\n- b: 2\n'
      );
      assert.deepStrictEqual(
        yaml.dump(arrayOfObj, { indent: 2 }),
        '- a: 1\n  b: abc\n- c: def\n  d: 2\n'
      );
} catch (err) {
}

try {
    assert.deepStrictEqual(
        yaml.dump(arrayOfSimpleObj, { indent: 3 }),
        '-\n   a: 1\n-\n   b: 2\n'
      );
      assert.deepStrictEqual(
        yaml.dump(arrayOfObj, { indent: 3 }),
        '-\n   a: 1\n   b: abc\n-\n   c: def\n   d: 2\n'
      );
} catch (err) {
}

try {
    assert.deepStrictEqual(
        yaml.dump(arrayOfSimpleObj, { indent: 4 }),
        '-\n    a: 1\n-\n    b: 2\n'
      );
      assert.deepStrictEqual(
        yaml.dump(arrayOfObj, { indent: 4 }),
        '-\n    a: 1\n    b: abc\n-\n    c: def\n    d: 2\n'
      );
} catch (err) {
}

var array = [ 'a', 'b' ];
var dumpedArray = yaml.dump(array, { flowLevel: 0, indent: 0, condenseFlow: true });
assert.strictEqual(
  dumpedArray,
  '[a,b]\n'
);
assert.deepStrictEqual(yaml.load(dumpedArray), array);

try{
    var object_ = { a: { b: 'c', d: 'e' } };
    var objectDump = yaml.dump(object_, { flowLevel: 0, indent: 0, condenseFlow: true });
    assert.strictEqual(
        objectDump,
        '{"a":{"b":c, "d":e}}\n'
    );
    assert.deepStrictEqual(yaml.load(objectDump), object_);

}catch(e){

}

var data = yaml.loadAll(`
---
a: 1
---
b: 2
`);

assert.deepStrictEqual(data, [ { a: 1 }, { b: 2 } ]);

try{
    try {
        yaml.load(`
    # intentionally invalid yaml
    
      foo: bar
    baz: qux
    `);
      } catch (err) {
        assert(err.stack.startsWith('YAMLException: end of the stream or a document separator is expected'));
        return;
      }
      assert.fail(null, null, 'Expected an error to be thrown');
}catch(e){

}

var tags = [ 'scalar', 'mapping', 'sequence' ].map(kind =>
    new yaml.Type('!', {
      kind,
      multi: true,
      resolve: function () {
        return true;
      },
      construct: function (value, tag) {
        return { kind, tag, value };
      }
    })
  );

var schema = yaml.DEFAULT_SCHEMA.extend(tags);



try{
  let expected = [
    {
        kind: 'scalar',
        tag: '!t1',
        value: '123'
    },
    {
        kind: 'sequence',
        tag: '!t2',
        value: [ 1, 2, 3 ]
    },
    {
        kind: 'mapping',
        tag: '!t3',
        value: { a: 1, b: 2 }
    }
    ];
  assert.deepStrictEqual(yaml.load(`
- !t1 123
- !t2 [ 1, 2, 3 ]
- !t3 { a: 1, b: 2 }
`, {
  schema: schema
  }), expected);
} catch(e) {

}

try{
  var tags = [ '!foo', '!bar', '!' ].map(prefix =>
    new yaml.Type(prefix, {
      kind: 'scalar',
      multi: true,
      resolve: function () {
        return true;
      },
      construct: function (value, tag) {
        return { prefix, tag, value };
      }
    })
  );

  tags.push(
    new yaml.Type('!bar', {
      kind: 'scalar',
      resolve: function () {
        return true;
      },
      construct: function (value) {
        return { single: true, value };
      }
    })
  );

  let schema = yaml.DEFAULT_SCHEMA.extend(tags);

  let expected = [
    { prefix: '!foo', tag: '!foo', value: '1' },
    { prefix: '!foo', tag: '!foo2', value: '2' },
    { single: true, value: '3' },
    { prefix: '!bar', tag: '!bar2', value: '4' },
    { prefix: '!', tag: '!baz', value: '5' }
  ];

  assert.deepStrictEqual(yaml.load(`
- !foo 1
- !foo2 2
- !bar 3
- !bar2 4
- !baz 5
`, {
    schema: schema
  }), expected);
} catch (e) {

}

try{
  let tags = [
    new yaml.Type('!', {
      kind: 'scalar',
      multi: true,
      predicate: function (obj) {
        return !!obj.tag;
      },
      representName: function (obj) {
        return obj.tag;
      },
      represent: function (obj) {
        return obj.value;
      }
    })
  ];

  let schema = yaml.DEFAULT_SCHEMA.extend(tags);

  assert.strictEqual(yaml.dump({ test: { tag: 'foo', value: 'bar' } }, {
    schema: schema
  }), 'test: !<foo> bar\n');
}catch(e){

}

try{
  var dump, src = { integer: -100 };

  dump = yaml.dump(src, { styles: { '!!int': 'binary' } });
  assert.deepStrictEqual(yaml.load(dump), src);
} catch(e) {

}
try{
  dump = yaml.dump(src, { styles: { '!!int': 'octal' } });
  assert.deepStrictEqual(yaml.load(dump), src);
} catch(e) {

}
try{
  dump = yaml.dump(src, { styles: { '!!int': 'hex' } });
  assert.deepStrictEqual(yaml.load(dump), src);
} catch(e) {

}

var dump, src;

src = { str: '\n  a\nb' };
dump = yaml.dump(src);
assert.deepStrictEqual(yaml.load(dump), src);

src = { str: '\n\n  a\nb' };
dump = yaml.dump(src);
assert.deepStrictEqual(yaml.load(dump), src);

src = { str: '\n  a\nb' };
dump = yaml.dump(src, { indent: 10 });
assert.deepStrictEqual(yaml.load(dump), src);

try{
  assert.throws(() => yaml.load('foo: "1" bar: "2"'), /bad indentation of a mapping entry/);
  assert.throws(() => yaml.load('- "foo" - "bar"'),   /bad indentation of a sequence entry/);
} catch(e) {

}

try{
  /* eslint-disable max-len */
  var output = yaml.dump(
    [
      {
        a: 'a_val',
        b: 'b_val'
      },
      {
        a: 'a2_val',
        items: [
          {
            a: 'a_a_val',
            b: 'a_b_val'
          }
        ]
      }
    ],
    { noArrayIndent: true }
  );
  var expected = '- a: a_val\n  b: b_val\n- a: a2_val\n  items:\n  - a: a_a_val\n    b: a_b_val\n';
  assert.strictEqual(output, expected);
} catch(e) {

}

var data = {
  // no quotes needed
  'http://example.com': 'http://example.com',
  // quotes required
  'foo: bar': 'foo: bar',
  'foo:': 'foo:'
};

var expected = `
http://example.com: http://example.com
'foo: bar': 'foo: bar'
'foo:': 'foo:'
`.replace(/^\n/, '');

assert.strictEqual(yaml.dump(data), expected);
assert.deepStrictEqual(yaml.load(expected), data);

try{
  try {
    yaml.load(readFileSync(require('path').join(__dirname, '/0475-case1.yml'), 'utf8'));
  } catch (err) {
    assert(err.stack.startsWith('YAMLException: nested arrays are not supported inside keys'));
    return;
  }
  assert.fail(null, null, 'Expected an error to be thrown');
}catch(e){

}

try{
  try {
    yaml.load(readFileSync(require('path').join(__dirname, '/0475-case2.yml'), 'utf8'));
  } catch (err) {
    assert(err.stack.startsWith('YAMLException: nested arrays are not supported inside keys'));
    return;
  }
  assert.fail(null, null, 'Expected an error to be thrown');
}catch(e){

}

assert.strictEqual(yaml.load(yaml.dump('=')), '=');
assert.strictEqual(yaml.dump('='), "'='\n");

var required = `
key1: a[]b
key2: a{}b
nested:
  key1: a[]b
  key2: a{}b
  nested: {key1: 'a[]b', key2: 'a{}b', nested: {key1: 'a[]b', key2: 'a{}b'}}
`.replace(/^\n/, '');

  var sample = {
    key1: 'a[]b',
    key2: 'a{}b',
    nested: {
      key1: 'a[]b',
      key2: 'a{}b',
      nested: {
        key1: 'a[]b',
        key2: 'a{}b',
        nested: {
          key1: 'a[]b',
          key2: 'a{}b'
        }
      }
    }
  };

  assert.strictEqual(
    yaml.dump(sample, { flowLevel: 2 }),
    required
  );


  var required = `
http://example.com/page#anchor: no:quotes#required
parameter#fallback: 'quotes #required'
'quotes: required': Visit [link](http://example.com/foo#bar)
'foo #bar': key is quoted
`.replace(/^\n/, '');

  var sample = {
    'http://example.com/page#anchor': 'no:quotes#required',
    'parameter#fallback': 'quotes #required',
    'quotes: required': 'Visit [link](http://example.com/foo#bar)',
    'foo #bar': 'key is quoted'
  };

  assert.strictEqual(
    yaml.dump(sample),
    required
  );

try{
  try {
    yaml.load('foo\0bar');
  } catch (err) {
    assert(err.stack.startsWith('YAMLException: null byte is not allowed in input'));
    return;
  }
}catch (err) {
}

try{
try {
  yaml.load('!<?> [0]');
} catch (err) {
  assert(err.stack.startsWith('YAMLException: unacceptable node kind for !<?> tag'));
  return;
}
}catch (err) {
}


var sample = {
  // normal key-value pair
  simple_key: 'value',

  // special characters in key
  'foo\'bar"baz': 1,

  // non-printables in key
  'foo\vbar': 1,

  // multiline key
  'foo\nbar\nbaz': 1,

  // ambiguous type, looks like a number
  '0x1234': 1,
  ambiguous: '0x1234',

  // ambiguous type, looks like a quoted string
  "'foo'": 1,
  ambiguous1: "'foo'",
  '"foo"': 1,
  ambiguous2: '"foo"',

  // quote in output
  quote1: "foo'bar",
  quote2: 'foo"bar',

  // spaces at the beginning or end
  space1: ' test',
  space2: 'test ',

  // test test test ...
  wrapped: 'test '.repeat(20).trim(),

  // multiline value
  multiline: 'foo\nbar\nbaz',

  // needs leading space indicator
  leading_space: '\n  test',

  // non-printables in value
  nonprintable1: 'foo\vbar',
  nonprintable2: 'foo\vbar ' + 'test '.repeat(20).trim(),
  nonprintable3: 'foo\vbar ' + 'foo\nbar\nbaz',

  // empty string
  empty: '',

  // bool compat
  yes: 'yes'
};


assert.strictEqual(yaml.dump(sample, { quotingType: "'", forceQuotes: false }), expected);

var expected = `
simple_key: value
foo'bar"baz: 1
"foo\\vbar": 1
"foo\\nbar\\nbaz": 1
"0x1234": 1
ambiguous: "0x1234"
"'foo'": 1
ambiguous1: "'foo'"
"\\"foo\\"": 1
ambiguous2: "\\"foo\\""
quote1: foo'bar
quote2: foo"bar
space1: " test"
space2: "test "
wrapped: >-
  test test test test test test test test test test test test test test test
  test test test test test
multiline: |-
  foo
  bar
  baz
leading_space: |2-

    test
nonprintable1: "foo\\vbar"
nonprintable2: "foo\\vbar test test test test test test test test test test test test test test test test test test test test"
nonprintable3: "foo\\vbar foo\\nbar\\nbaz"
empty: ""
"yes": "yes"
`.replace(/^\n/, '');

    assert.strictEqual(yaml.dump(sample, { quotingType: '"', forceQuotes: false }), expected);


var expected = `
simple_key: 'value'
foo'bar"baz: 1
"foo\\vbar": 1
"foo\\nbar\\nbaz": 1
'0x1234': 1
ambiguous: '0x1234'
'''foo''': 1
ambiguous1: '''foo'''
'"foo"': 1
ambiguous2: '"foo"'
quote1: 'foo''bar'
quote2: 'foo"bar'
space1: ' test'
space2: 'test '
wrapped: 'test test test test test test test test test test test test test test test test test test test test'
multiline: "foo\\nbar\\nbaz"
leading_space: "\\n  test"
nonprintable1: "foo\\vbar"
nonprintable2: "foo\\vbar test test test test test test test test test test test test test test test test test test test test"
nonprintable3: "foo\\vbar foo\\nbar\\nbaz"
empty: ''
'yes': 'yes'
`.replace(/^\n/, '');

assert.strictEqual(yaml.dump(sample, { quotingType: "'", forceQuotes: true }), expected);

var expected = `
simple_key: "value"
foo'bar"baz: 1
"foo\\vbar": 1
"foo\\nbar\\nbaz": 1
"0x1234": 1
ambiguous: "0x1234"
"'foo'": 1
ambiguous1: "'foo'"
"\\"foo\\"": 1
ambiguous2: "\\"foo\\""
quote1: "foo'bar"
quote2: "foo\\"bar"
space1: " test"
space2: "test "
wrapped: "test test test test test test test test test test test test test test test test test test test test"
multiline: "foo\\nbar\\nbaz"
leading_space: "\\n  test"
nonprintable1: "foo\\vbar"
nonprintable2: "foo\\vbar test test test test test test test test test test test test test test test test test test test test"
nonprintable3: "foo\\vbar foo\\nbar\\nbaz"
empty: ""
"yes": "yes"
`.replace(/^\n/, '');

assert.strictEqual(yaml.dump(sample, { quotingType: '"', forceQuotes: true }), expected);


var dump, src = { foo: null, bar: 1 };

var tests = {
  lowercase: 'null',
  uppercase: 'NULL',
  camelcase: 'Null',
  canonical: '~',
  empty: ''
};

for (let [ name, value ] of Object.entries(tests)) {
  dump = yaml.dump(src, { styles: { '!!null': name } });
  assert.strictEqual(dump, 'foo: ' + value + '\nbar: 1\n');
  assert.deepStrictEqual(yaml.load(dump), src);
}

var undef = new yaml.Type('!undefined', {
  kind: 'scalar',
  resolve: () => true,
  construct: () => {},
  predicate: object => typeof object === 'undefined',
  represent: () => ''
});

var undef_schema = yaml.DEFAULT_SCHEMA.extend(undef);

var str;

    str = yaml.dump([ undefined, 1, undefined, null, 2 ], { flowLevel: 0 });
    assert(str.match(/^\[/));
    assert.deepStrictEqual(
      yaml.load(str),
      [ null, 1, null, null, 2 ]
    );

    str = yaml.dump([ undefined, 1, undefined, null, 2 ], { flowLevel: -1 });
    assert(str.match(/^- /));
    assert.deepStrictEqual(
      yaml.load(str),
      [ null, 1, null, null, 2 ]
    );

    var str;

    str = yaml.dump({ t: undefined, foo: 1, bar: undefined, baz: null }, { flowLevel: 0 });
    assert(str.match(/^\{/));
    assert.deepStrictEqual(
      yaml.load(str),
      { foo: 1, baz: null }
    );

    str = yaml.dump({ t: undefined, foo: 1, bar: undefined, baz: null }, { flowLevel: -1 });
    assert(str.match(/^foo:/));
    assert.deepStrictEqual(
      yaml.load(str),
      { foo: 1, baz: null }
    );

    assert.strictEqual(yaml.dump(undefined), '');

    assert.deepStrictEqual(
      yaml.load(
        yaml.dump([ 1, undefined, null, 2 ], { schema: undef_schema }),
        { schema: undef_schema }
      ),
      [ 1, undefined, null, 2 ]
    );

    assert.deepStrictEqual(
      yaml.load(
        yaml.dump({ foo: 1, bar: undefined, baz: null }, { schema: undef_schema }),
        { schema: undef_schema }
      ),
      { foo: 1, bar: undefined, baz: null }
    );

    assert.strictEqual(
      yaml.dump([ undefined ], { styles: { '!!null': 'uppercase' } }),
      '- NULL\n'
    );

    assert.throws(() => {
      yaml.dump([ 'foo', undefined, 'bar' ], { schema: yaml.FAILSAFE_SCHEMA });
    }, /unacceptable kind of an object to dump/);

    assert.strictEqual(
      yaml.dump([ () => {}, 'a' ], { flowLevel: 0, skipInvalid: true }),
      '[a]\n');

    assert.strictEqual(
      yaml.dump([ () => {}, 'a' ], { flowLevel: -1, skipInvalid: true }),
      '- a\n');

    assert.strictEqual(
      yaml.dump({ a: () => {}, b: 'a' }, { flowLevel: 0, skipInvalid: true }),
      '{b: a}\n');

    assert.strictEqual(
      yaml.dump({ a: () => {}, b: 'a' }, { flowLevel: -1, skipInvalid: true }),
      'b: a\n');



var dump, src = { foo: null, bar: 1 };

var tests = {
  lowercase: 'null',
  uppercase: 'NULL',
  camelcase: 'Null',
  canonical: '~',
  empty: ''
};

for (let [ name, value ] of Object.entries(tests)) {
  dump = yaml.dump(src, { styles: { '!!null': name } });
  assert.strictEqual(dump, 'foo: ' + value + '\nbar: 1\n');
  assert.deepStrictEqual(yaml.load(dump), src);
}

var undef = new yaml.Type('!undefined', {
  kind: 'scalar',
  resolve: () => true,
  construct: () => {},
  predicate: object => typeof object === 'undefined',
  represent: () => ''
});

var undef_schema = yaml.DEFAULT_SCHEMA.extend(undef);


var str;

str = yaml.dump([ undefined, 1, undefined, null, 2 ], { flowLevel: 0 });
assert(str.match(/^\[/));
assert.deepStrictEqual(
  yaml.load(str),
  [ null, 1, null, null, 2 ]
);

str = yaml.dump([ undefined, 1, undefined, null, 2 ], { flowLevel: -1 });
assert(str.match(/^- /));
assert.deepStrictEqual(
  yaml.load(str),
  [ null, 1, null, null, 2 ]
);


var str;

str = yaml.dump({ t: undefined, foo: 1, bar: undefined, baz: null }, { flowLevel: 0 });
assert(str.match(/^\{/));
assert.deepStrictEqual(
  yaml.load(str),
  { foo: 1, baz: null }
);

str = yaml.dump({ t: undefined, foo: 1, bar: undefined, baz: null }, { flowLevel: -1 });
assert(str.match(/^foo:/));
assert.deepStrictEqual(
  yaml.load(str),
  { foo: 1, baz: null }
);

assert.strictEqual(yaml.dump(undefined), '');

assert.deepStrictEqual(
  yaml.load(
    yaml.dump([ 1, undefined, null, 2 ], { schema: undef_schema }),
    { schema: undef_schema }
  ),
  [ 1, undefined, null, 2 ]
);

assert.deepStrictEqual(
  yaml.load(
    yaml.dump({ foo: 1, bar: undefined, baz: null }, { schema: undef_schema }),
    { schema: undef_schema }
  ),
  { foo: 1, bar: undefined, baz: null }
);

assert.strictEqual(
  yaml.dump([ undefined ], { styles: { '!!null': 'uppercase' } }),
  '- NULL\n'
);

assert.throws(() => {
  yaml.dump([ 'foo', undefined, 'bar' ], { schema: yaml.FAILSAFE_SCHEMA });
}, /unacceptable kind of an object to dump/);


assert.strictEqual(
  yaml.dump([ () => {}, 'a' ], { flowLevel: 0, skipInvalid: true }),
  '[a]\n');

assert.strictEqual(
  yaml.dump([ () => {}, 'a' ], { flowLevel: -1, skipInvalid: true }),
  '- a\n');

assert.strictEqual(
  yaml.dump({ a: () => {}, b: 'a' }, { flowLevel: 0, skipInvalid: true }),
  '{b: a}\n');

assert.strictEqual(
  yaml.dump({ a: () => {}, b: 'a' }, { flowLevel: -1, skipInvalid: true }),
  'b: a\n');

var tag_names = [ 'tag', '!tag', '!!tag', '!<!tag>', 'tag*-!< >{\n}', '!tagαβγ' ];
var encoded   = [ '!<tag>', '!tag', '!%21tag', '!%3C%21tag%3E',
  '!<tag*-%21%3C%20%3E%7B%0A%7D>', '!tag%CE%B1%CE%B2%CE%B3' ];

var tags = tag_names.map(tag =>
  new yaml.Type(tag, {
    kind: 'scalar',
    resolve: () => true,
    construct: object => [ tag, object ],
    predicate: object => object.tag === tag,
    represent: () => 'value'
  })
);

var schema = yaml.DEFAULT_SCHEMA.extend(tags);

tag_names.forEach(function (tag, idx) {
  assert.strictEqual(yaml.dump({ tag }, { schema }), encoded[idx] + ' value\n');
});

encoded.forEach(function (tag, idx) {
  assert.deepStrictEqual(yaml.load(tag + ' value', { schema }), [ tag_names[idx], 'value' ]);
});

assert.strictEqual(yaml.load('!!%69nt 123'), 123);
assert.strictEqual(yaml.load('!!%73tr 123'), '123');

assert.deepStrictEqual(yaml.load(`
%TAG !xx! %74a
---
!xx!g 123
`, { schema }), [ 'tag', '123' ]);


function CustomDump(data, opts) {
  if (!(this instanceof CustomDump)) return new CustomDump(data, opts);
  this.data = data;
  this.opts = opts;
}

CustomDump.prototype.represent = function () {
  let result = yaml.dump(this.data, Object.assign({ replacer, schema }, this.opts));
  result = result.trim();
  if (result.includes('\n')) result = '\n' + result;
  return result;
};


let CustomDumpType = new yaml.Type('!format', {
  kind: 'scalar',
  resolve: () => false,
  instanceOf: CustomDump,
  represent: d => d.represent()
});


var schema = yaml.DEFAULT_SCHEMA.extend({ implicit: [ CustomDumpType ] });

function replacer(key, value) {
  if (key === '') return value; // top-level, don't change this
  if (key === 'flow_choices') return CustomDump(value, { flowLevel: 0 });
  if (key === 'block_choices') return CustomDump(value, { flowLevel: Infinity });
  return value; // default
}

var result = CustomDump({ flow_choices : [ 1, 2 ], block_choices: [ 4, 5 ] }).represent().trim();

assert.strictEqual(result, `
flow_choices: [1, 2]
block_choices:
- 4
- 5`.replace(/^\n/, ''));

assert.strictEqual(yaml.dump('😃😊'), '😃😊\n');


let options = Object.assign({}, yaml.types.int.options);

  

  let BigIntType = new yaml.Type('tag:yaml.org,2002:int', options);

  var SCHEMA = yaml.DEFAULT_SCHEMA.extend({ implicit: [ BigIntType ] });

  var data = `
int: -123_456_789
bigint: -12_345_678_901_234_567_890
float: -12_345_678_901_234_567_890.1234
`;


