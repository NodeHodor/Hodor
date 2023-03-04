var test = require('tape');
var Realm = require('realms-shim');

test('function-no-body', t => {
  const r = Realm.makeRootRealm();
  const f1 = new r.global.Function();
  const src = f1.toString();
  t.notOk(src.includes('undefined'));
  t.equal(f1(), undefined);
  t.end();
});

test('function-injection', t => {
  const goodFunc = 'return a+1';
  const r = Realm.makeRootRealm();
  const f1 = new r.global.Function('a', goodFunc);
  t.equal(f1(5), 6);

  // the naive expansion is: '(function(a) {'  +  evilFunc  +  '})'
  // e.g. `(function(a) { ${evilFunc} })`

  // we want to trick that into defining one function and evaluating
  // something else (which is evil)
  // like: '(function(a) {'  +  '}, this.haha = 666, {'  +  '})'
  // which becomes: (function(a) {}, this.haha = 666, {})

  const evilFunc = '}, this.haha = 666, {';
  t.throws(() => new r.global.Function('a', evilFunc), r.global.SyntaxError);
  t.equal(r.global.haha, undefined);

  t.end();
});

test('function-injection-2', t => {
  const r = Realm.makeRootRealm();
  let flag = false;
  r.global.target = function() {
    flag = true;
  };
  function check(...args) {
    t.throws(() => r.global.Function(...args), r.global.SyntaxError, args);
    t.equal(flag, false);
  }

  // test cases from https://code.google.com/archive/p/google-caja/issues/1616
  check(`}), target(), (function(){`);
  check(`})); }); target(); (function(){ ((function(){ `);

  // and from https://bugs.chromium.org/p/v8/issues/detail?id=2470
  check('/*', '*/){');
  check('', '});(function(){');
  check('//', '//'); // we reject these even though that bug allows them
  check('', `});print('1+1=' + (1+1));(function(){`);

  // and from https://bugs.webkit.org/show_bug.cgi?id=106160
  check('){});(function(', '');
  check('', '});(function(){');
  check('//', '//'); // we reject these even though that bug allows them
  check('/*', '*/){');
  check('}}; 1 * {a:{');

  // bug from Matt Austin: this is surprising but doesn't allow new access
  check('arg=`', '/*body`){});({x: this/**/');
  // a naive evaluation might do this:
  //     (function(arg=`){
  //      /*body`){});({x: this/**/
  //     })

  // In which the backtick in arg= eats both the )} that we add and the /*
  // that the body adds, allowing the body to terminate the function
  // definition. Then the body defines a new expression, which creates an
  // object with a property named "x" which captures the same 'this' you
  // could have gotten with plain safe eval().

  // markm tried to protect against this by injecting an extra trailing
  // block comment to the end of the arguments, creating a body like this

  //     (function(arg=`
  //     /*``*/){
  //      /*body`){});({x: this/**/
  //     })

  // In this version, the backtick from arg= eats the first part of the
  // injected block comment, and the backtick from the body matches the
  // second part of the injected block comment. That yields a
  // syntactically-valid but semantically-invalid default argument with a
  // value of `\n/*``*/){\n/*body` , in which the first template literal
  // (`\n/*`) evaluates to a string ("\n/*") which is then used as the
  // template-literal-tag for the second template literal. This is
  // semantically invalid because strings cannot be called as functions, but
  // the syntax is still valid. The constructed function is bypassed, so its
  // default argument is never evaluated, so this invalidity doesn't matter.

  // To protect against this, we'll just forbid everything except simple
  // identifiers in Function constructor calls: no default arguments ("=")
  // and no pattern matching expressions ("[a,b]"). You can still use complex
  // arguments in function definitions, just not in calls to the Function
  // constructor.

  t.end();
});

test('function-reject-paren-default', t => {
  // this ought to be accepted, but our shim is conservative about parenthesis
  const r = Realm.makeRootRealm();
  const goodFunc = 'return foo';
  t.throws(
    () => new r.global.Function('foo, a = new Date(0)', goodFunc),
    r.global.SyntaxError
  );
  t.end();
});

// our shim is conservative about parameters: we only accept simple
// identifiers; no default arguments, no pattern matching, no ...rest
// parameters
test('function-default-parameters', t => {
  const goodFunc = 'return a+1';
  const r = Realm.makeRootRealm();
  t.throws(() => new r.global.Function('a=1', goodFunc), r.global.SyntaxError);
  t.end();
});

test('function-rest-parameters', t => {
  const goodFunc = 'return rest[0] + rest[1]';
  const r = Realm.makeRootRealm();
  t.throws(
    () => new r.global.Function('...rest', goodFunc),
    r.global.SyntaxError
  );
  t.end();
});

test('function-destructuring-parameters', t => {
  const goodFunc = 'return foo + bar + baz';
  const r = Realm.makeRootRealm();
  t.throws(
    () => new r.global.Function('{foo, bar}, baz', goodFunc),
    r.global.SyntaxError
  );
  t.end();
});

test('function-legitimate-but-weird-parameters', t => {
  const r = Realm.makeRootRealm();
  const goodFunc = 'return foo + bar + baz';
  const f1 = new r.global.Function('foo, bar', 'baz', goodFunc);
  t.equal(f1(1, 2, 3), 6);

  const goodFunc2 = 'return foo + bar[0] + bar[1]';
  t.throws(
    () => new r.global.Function('foo, bar = [1', '2]', goodFunc2),
    r.global.SyntaxError
  );

  t.end();
});

test('degenerate-pattern-match-argument', t => {
  const r = Realm.makeRootRealm();
  const goodFunc = 'return foo + bar + baz';
  // this syntax is rejected by the normal JS parser, not by anything special
  // about Realms
  t.throws(() => new r.global.Function('3', goodFunc), r.global.SyntaxError);

  t.end();
});

test('frozen-eval', t => {
  const r = Realm.makeRootRealm();

  const desc = Object.getOwnPropertyDescriptor(r.global, 'eval');
  desc.writable = false;
  desc.configurable = false;
  Object.defineProperty(r.global, 'eval', desc);

  t.equal(r.evaluate('(0,eval)(1)'), 1);

  t.end();
});
// JSON is an ordinary intrinsic
test('identity JSON', t => {
  t.plan(4);

  const r1 = Realm.makeRootRealm();
  const r2 = r1.global.Realm.makeCompartment();

  t.equal(r2.evaluate('JSON'), r2.evaluate('JSON'));
  t.equal(r2.evaluate('JSON'), r2.evaluate('(1,eval)("JSON")'));
  t.notEqual(r2.evaluate('JSON'), JSON);
  t.equal(r2.evaluate('JSON'), r1.evaluate('JSON'));
});

// Realm is a facade root-realm-specific
test('identity Realm', t => {
  t.plan(8);

  const r1 = Realm.makeRootRealm();
  const r2 = r1.global.Realm.makeCompartment();

  t.ok(r2.evaluate('Realm instanceof Function'));
  t.ok(r2.evaluate('Realm instanceof Object'));
  t.ok(r2.evaluate('Realm') instanceof r1.evaluate('Function'));
  t.ok(r2.evaluate('Realm') instanceof r1.evaluate('Object'));
  t.notOk(r2.evaluate('Realm') instanceof Function);
  t.notOk(r2.evaluate('Realm') instanceof Object);
  t.equal(r2.evaluate('Realm'), r1.evaluate('Realm'));
  t.notEqual(r2.evaluate('Realm'), Realm);
});

// eval is realm-specific
test('identity eval', t => {
  t.plan(8);

  const r1 = Realm.makeRootRealm();
  const r2 = r1.global.Realm.makeCompartment();

  t.ok(r2.evaluate('eval instanceof Function'));
  t.ok(r2.evaluate('eval instanceof Object'));
  t.ok(r2.evaluate('eval') instanceof r1.evaluate('Function'));
  t.ok(r2.evaluate('eval') instanceof r1.evaluate('Object'));
  t.notOk(r2.evaluate('eval') instanceof Function);
  t.notOk(r2.evaluate('eval') instanceof Object);
  t.notEqual(r2.evaluate('eval'), r1.evaluate('eval'));
  t.notEqual(r2.evaluate('eval'), eval);
});

// Function is realm-specific
test('identity Function', t => {
  t.plan(11);

  const r1 = Realm.makeRootRealm();
  const r2 = r1.global.Realm.makeCompartment();
  const r3 = r1.global.Realm.makeCompartment();

  t.ok(r2.evaluate('Function instanceof Function'));
  t.ok(r2.evaluate('Function instanceof Object'));
  t.ok(r2.evaluate('Function') instanceof r1.evaluate('Function'));
  t.ok(r2.evaluate('Function') instanceof r1.evaluate('Object'));
  t.notOk(r2.evaluate('Function') instanceof Function);
  t.notOk(r2.evaluate('Function') instanceof Object);
  t.notEqual(r2.evaluate('Function'), r1.evaluate('Function'));
  t.notEqual(r2.evaluate('Function'), Function);

  const f2 = r2.evaluate('function x(a, b) { return a+b; }; x');
  t.ok(f2 instanceof r1.global.Function);
  t.ok(f2 instanceof r2.global.Function);
  t.ok(f2 instanceof r3.global.Function);
});

// JSON is an ordinary intrinsic
test('identity JSON', t => {
  t.plan(5);

  const r = Realm.makeRootRealm();

  t.equal(r.evaluate('JSON'), r.evaluate('JSON'));
  t.equal(r.evaluate('JSON'), r.evaluate('(1,eval)("JSON")'));
  t.equal(r.evaluate('JSON'), r.evaluate('(new Function("return JSON"))()'));
  t.equal(r.evaluate('JSON'), r.global.JSON);
  t.notEqual(r.evaluate('JSON'), JSON);
});

// Realm is a facade root-realm-specific
test('identity Realm', t => {
  t.plan(5);

  const r = Realm.makeRootRealm();

  t.ok(r.evaluate('Realm instanceof Function'));
  t.ok(r.evaluate('Realm instanceof Object'));
  t.notOk(r.evaluate('Realm') instanceof Function);
  t.notOk(r.evaluate('Realm') instanceof Object);
  t.notEqual(r.evaluate('Realm'), Realm);
});

// eval is realm-specific
test('identity eval', t => {
  t.plan(3);

  const r = Realm.makeRootRealm();

  t.ok(r.evaluate('eval instanceof Function'));
  t.ok(r.evaluate('eval instanceof Object'));
  t.notEqual(r.evaluate('eval'), eval);
});

// Function is realm-specific
test('identity Function', t => {
  t.plan(5);

  const r = Realm.makeRootRealm();

  t.ok(r.evaluate('Function instanceof Function'));
  t.ok(r.evaluate('Function instanceof Object'));
  t.notOk(r.evaluate('Function') instanceof Function);
  t.notOk(r.evaluate('Function') instanceof Object);

  const f = r.evaluate('function x(a, b) { return a+b; }; x');
  t.ok(f instanceof r.global.Function);
});


test('Reflect.constructor should not leak primal realm prototypes via setting Function.prototype to null', t => {
  t.plan(2);

  const r = Realm.makeRootRealm();

  const obj = r.evaluate(`
  	Function.prototype = null;
  	Reflect.construct(Object, [], Function);
  `);

  t.notOk(obj instanceof Object, "should not be parent's realm Object");
  t.ok(obj instanceof r.global.Object);
});

test('Reflect.constructor should not leak primal realm prototypes via hiding Function.prototype', t => {
  t.plan(2);

  const r = Realm.makeRootRealm();

  const obj = r.evaluate(`
  	const proxy = new Proxy(Function, { get: (target, prop) => prop === 'prototype' ? null : target[prop] });
  	Reflect.construct(Object, [], proxy);
  `);

  t.notOk(obj instanceof Object, "should not be parent's realm Object");
  t.ok(obj instanceof r.global.Object);
});

test('Reflect.constructor should not leak primal realm prototypes via a new function from Function.bind()', t => {
  t.plan(2);

  const r = Realm.makeRootRealm();

  const obj = r.evaluate(`
  	const fn = Function.bind();
  	Reflect.construct(Object, [], fn);
  `);

  t.notOk(obj instanceof Object, "should not be parent's realm Object");
  t.ok(obj instanceof r.global.Object);
});


test('transforms - rewriterState', t => {
  let rewriteArguments;

  const r = Realm.makeRootRealm();
  r.evaluate('', undefined, {
    transforms: [
      {
        rewrite(rewriterState) {
          rewriteArguments = arguments;
          // resume
          return rewriterState;
        }
      }
    ]
  });

  // "arguments" use intrinsics from the current realm.
  t.equal(rewriteArguments.length, 1);
  t.ok(rewriteArguments instanceof Object);

  // rewriterState is using intrinsics from the target realm.
  const [rewriteState] = rewriteArguments;
  t.ok(rewriteState instanceof r.global.Object);

  t.end();
});

test('transforms - transforms array', t => {
  let callCount = 0;

  class BadArray extends Array {
    reduce() {
      callCount++;
      // resume
      return Array.prototype.reduce.apply(this, arguments);
    }
  }

  const r = Realm.makeRootRealm();
  const transforms = new BadArray();
  r.evaluate('', undefined, { transforms });

  // Should use the curried form, and remain safe to poisoning.
  t.equal(callCount, 0);

  t.end();
});

test('most Realm globals are mutable', t => {
  t.plan(3);
  const r = Realm.makeRootRealm();

  r.evaluate('Date = function() { return "bogus" }');
  t.equal(r.evaluate('Date()'), 'bogus');

  r.evaluate('Math.embiggen = function(a) { return a+1 }');
  t.equal(r.evaluate('Math.embiggen(1)'), 2);

  r.evaluate('Realm = function(opts) { this.extra = "extra" }');
  t.equal(r.evaluate('(new Realm({})).extra'), 'extra');
});

test('some Realm globals are immutable', t => {
  t.plan(6);
  const r = Realm.makeRootRealm();

  t.throws(() => r.evaluate('Infinity = 4'), TypeError); // strict mode
  t.equal(r.evaluate('Infinity'), Infinity);

  t.throws(() => r.evaluate('NaN = 4'), TypeError);
  t.notEqual(r.evaluate('NaN'), 4);

  t.throws(() => r.evaluate('undefined = 4'), TypeError);
  t.equal(r.evaluate('undefined'), undefined);
});

test('confinement evaluation strict mode', t => {
  t.plan(2);

  const r = Realm.makeRootRealm();

  t.equal(r.evaluate('(function() { return this })()'), undefined);
  t.equal(r.evaluate('(new Function("return this"))()'), undefined);
});

test('constructor this binding', t => {
  const r = Realm.makeRootRealm();
  const F = r.evaluate('(new Function("return this"))');

  t.equal(F(), undefined);
  t.equal(F.call(8), 8);
  t.equal(F.call(undefined), undefined);
  t.equal(Reflect.apply(F, 8, []), 8);

  const x = { F };
  t.equal(x.F(), x);

  t.end();
});

test('confinement evaluation constructor', t => {
  t.plan(2);

  const r = Realm.makeRootRealm();

  t.throws(() => {
    r.evaluate('({}).constructor.constructor("return this")()');
  }, Error);

  // Error is a function, so Error.__proto__ is Function.prototype . The
  // unpatched Function.prototype.constructor used to point at the unsafe
  // 'Function' object, which would provide access to the primal realm's
  // globals, so it must be kept out of the hands of any child realm. We
  // replace that '.constructor' with a safe replacement (which always
  // throws). Here we test that this constructor has been replaced.
  t.throws(() => {
    r.evaluate('Error.__proto__.constructor("return this")()');
  }, Error);
});

test('confinement evaluation eval', t => {
  t.plan(2);

  const r = Realm.makeRootRealm();

  // Strict mode
  t.equal(r.evaluate('(0, eval)("this")'), r.global);
  t.equal(r.evaluate('var evil = eval; evil("this")'), r.global);
});


test('set globals', t => {
  const r = Realm.makeRootRealm();

  // strict mode should prevent this
  t.throws(() => r.evaluate('evil = 666'), ReferenceError);

  r.global.victim = 3;
  r.evaluate('victim = 666');
  t.equal(r.global.victim, 666);

  t.end();
});


test('eval.toString', t => {
  const r = Realm.makeRootRealm();

  t.equal(r.evaluate('eval.toString()'), 'function eval() { [shim code] }');
  t.equal(r.evaluate('""+eval'), 'function eval() { [shim code] }');

  t.equal(
    r.evaluate('Object.getPrototypeOf(eval.toString)'),
    r.global.Function.prototype,
    'eval has correct prototype'
  );
  t.notEqual(
    r.evaluate('Object.getPrototypeOf(eval.toString)'),
    Function.prototype,
    "eval doesn't leak primal Function.prototype"
  );
  t.end();
});
