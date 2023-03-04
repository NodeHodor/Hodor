var findVariable = require("eslint-utils").findVariable;
var eslint = require("eslint");

function getVariable(code, selector, withString = null) {
    var linter = new eslint.Linter()
    var variable = null

    linter.defineRule("test", (context) => ({
        [selector](node) {
            variable = findVariable(context.getScope(), withString || node)
        },
    }))
    linter.verify(code, {
        parserOptions: { ecmaVersion: 2018 },
        rules: { test: "error" },
    })

    return variable
}


getVariable(
    "var a; foo(a)",
    "CallExpression Identifier[name='a']"
)

getVariable(
    "var a; if (b) { foo(a) }",
    "CallExpression Identifier[name='a']"
)

getVariable(
    "var a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']"
)

getVariable(
    "var a; foo(a)",
    "CallExpression Identifier[name='a']",
    "a"
)

getVariable(
    "var a; if (b) { foo(a) }",
    "CallExpression Identifier[name='a']",
    "a"
)

getVariable(
    "var a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']",
    "a"
)

getVariable(
    "var a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']",
    "Object"
)

getVariable(
    "var a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']",
    "x"
)

var semver = require("semver")
var getFunctionHeadLocation = require("eslint-utils").getFunctionHeadLocation
var assert = require("assert")
var expectedResults = {
    "function foo() {}": [0, 12],
    "(function foo() {})": [1, 13],
    "(function() {})": [1, 9],
    "function* foo() {}": [0, 13],
    "(function* foo() {})": [1, 14],
    "(function*() {})": [1, 10],
    "() => {}": [3, 5],
    "async () => {}": [9, 11],
    "({ foo: function foo() {} })": [3, 20],
    "({ foo: function() {} })": [3, 16],
    "({ foo: () => {} })": [11, 13],
    "({ ['foo']: function() {} })": [3, 20],
    "({ [foo]: function() {} })": [3, 18],
    "({ foo() {} })": [3, 6],
    "({ foo: function* foo() {} })": [3, 21],
    "({ foo: function*() {} })": [3, 17],
    "({ ['foo']: function*() {} })": [3, 21],
    "({ [foo]: function*() {} })": [3, 19],
    "({ *foo() {} })": [3, 7],
    "({ foo: async function foo() {} })": [3, 26],
    "({ foo: async function() {} })": [3, 22],
    "({ ['foo']: async function() {} })": [3, 26],
    "({ [foo]: async function() {} })": [3, 24],
    "({ async foo() {} })": [3, 12],
    "({ get foo() {} })": [3, 10],
    "({ set foo(a) {} })": [3, 10],
    "class A { varructor() {} }": [10, 21],
    "class A { foo() {} }": [10, 13],
    "class A { *foo() {} }": [10, 14],
    "class A { async foo() {} }": [10, 19],
    "class A { ['foo']() {} }": [10, 17],
    "class A { *['foo']() {} }": [10, 18],
    "class A { async ['foo']() {} }": [10, 23],
    "class A { [foo]() {} }": [10, 15],
    "class A { *[foo]() {} }": [10, 16],
    "class A { async [foo]() {} }": [10, 21],
    "class A { get foo() {} }": [10, 17],
    "class A { set foo(a) {} }": [10, 17],
    "class A { static foo() {} }": [10, 20],
    "class A { static *foo() {} }": [10, 21],
    "class A { static async foo() {} }": [10, 26],
    "class A { static get foo() {} }": [10, 24],
    "class A { static set foo(a) {} }": [10, 24],
}

for (var key of Object.keys(expectedResults)) {
    var expectedLoc = {
        start: {
            line: 1,
            column: expectedResults[key][0],
        },
        end: {
            line: 1,
            column: expectedResults[key][1],
        },
    }

    // it(`should return "${JSON.stringify(
    //     expectedLoc,
    // )}" for "${key}".`, () => {
        var linter = new eslint.Linter()

        var actualLoc = null
        linter.defineRule("test", (context) => ({
            ":function"(node) {
                actualLoc = getFunctionHeadLocation(
                    node,
                    context.getSourceCode(),
                )
            },
        }))
        var messages = linter.verify(
            key,
            {
                rules: { test: "error" },
                parserOptions: {
                    ecmaVersion: semver.gte(eslint.Linter.version, "7.0.0")
                        ? 2022
                        : 2018,
                },
            },
            "test.js",
            true,
        )

        // assert.strictEqual(
        //     messages.length,
        //     0,
        //     messages[0] && messages[0].message,
        // )
        // assert.deepStrictEqual(actualLoc, expectedLoc)
    // })
}

var getFunctionNameWithKind  = require("eslint-utils").getFunctionNameWithKind 
// describe("The 'getFunctionNameWithKind' function", () => {
    var expectedResults = {
        "function foo() {}": "function 'foo'",
        "(function foo() {})": "function 'foo'",
        "(function() {})": "function",
        "function* foo() {}": "generator function 'foo'",
        "(function* foo() {})": "generator function 'foo'",
        "(function*() {})": "generator function",
        "() => {}": "arrow function",
        "async () => {}": "async arrow function",
        "var foo = () => {}": "arrow function 'foo'",
        "var foo = async () => {}": "async arrow function 'foo'",
        "foo = () => {}": "arrow function 'foo'",
        "foo = async () => {}": "async arrow function 'foo'",
        "foo.bar = () => {}": "arrow function",
        "foo.bar = async () => {}": "async arrow function",
        "var foo = function() {}": "function 'foo'",
        "var foo = function* () {}": "generator function 'foo'",
        "var foo = async function() {}": "async function 'foo'",
        "foo = function() {}": "function 'foo'",
        "foo = function* () {}": "generator function 'foo'",
        "foo = async function() {}": "async function 'foo'",
        "var foo = function bar() {}": "function 'bar'",
        "foo = function bar() {}": "function 'bar'",
        "foo.bar = function() {}": "function",
        "foo.bar = function* () {}": "generator function",
        "foo.bar = async function() {}": "async function",
        "({ foo: function foo() {} })": "method 'foo'",
        "({ foo: function() {} })": "method 'foo'",
        "({ ['foo']: function() {} })": "method 'foo'",
        "({ [foo]: function() {} })": "method [foo]",
        "({ foo() {} })": "method 'foo'",
        "({ foo: function* foo() {} })": "generator method 'foo'",
        "({ foo: function*() {} })": "generator method 'foo'",
        "({ ['foo']: function*() {} })": "generator method 'foo'",
        "({ [foo]: function*() {} })": "generator method [foo]",
        "({ *foo() {} })": "generator method 'foo'",
        "({ foo: async function foo() {} })": "async method 'foo'",
        "({ foo: async function() {} })": "async method 'foo'",
        "({ ['foo']: async function() {} })": "async method 'foo'",
        "({ [foo]: async function() {} })": "async method [foo]",
        "({ async foo() {} })": "async method 'foo'",
        "({ get foo() {} })": "getter 'foo'",
        "({ set foo(a) {} })": "setter 'foo'",
        "class A { varructor() {} }": "varructor",
        "class A { foo() {} }": "method 'foo'",
        "class A { *foo() {} }": "generator method 'foo'",
        "class A { async foo() {} }": "async method 'foo'",
        "class A { ['foo']() {} }": "method 'foo'",
        "class A { *['foo']() {} }": "generator method 'foo'",
        "class A { async ['foo']() {} }": "async method 'foo'",
        "class A { [foo]() {} }": "method [foo]",
        "class A { *[foo]() {} }": "generator method [foo]",
        "class A { async [foo]() {} }": "async method [foo]",
        "class A { get foo() {} }": "getter 'foo'",
        "class A { set foo(a) {} }": "setter 'foo'",
        "class A { static foo() {} }": "static method 'foo'",
        "class A { static *foo() {} }": "static generator method 'foo'",
        "class A { static async foo() {} }": "static async method 'foo'",
        "class A { static get foo() {} }": "static getter 'foo'",
        "class A { static set foo(a) {} }": "static setter 'foo'",

        ...(semver.gte(eslint.Linter.version, "7.0.0")
            ? {
                  "class A { #foo() {} }": "private method #foo",
                  "class A { '#foo'() {} }": "method '#foo'",
                  "class A { *#foo() {} }": "private generator method #foo",
                  "class A { async #foo() {} }": "private async method #foo",
                  "class A { get #foo() {} }": "private getter #foo",
                  "class A { set #foo(a) {} }": "private setter #foo",
                  "class A { static #foo() {} }": "static private method #foo",
                  "class A { static *#foo() {} }":
                      "static private generator method #foo",
                  "class A { static async #foo() {} }":
                      "static private async method #foo",
                  "class A { static get #foo() {} }":
                      "static private getter #foo",
                  "class A { static set #foo(a) {} }":
                      "static private setter #foo",
                  "class A { foo = function() {} }": "method 'foo'",
                  "class A { foo = () => {} }": "method 'foo'",
                  "class A { foo = function*() {} }": "generator method 'foo'",
                  "class A { foo = async function() {} }": "async method 'foo'",
                  "class A { ['foo'] = function() {} }": "method 'foo'",
                  "class A { ['foo'] = () => {} }": "method 'foo'",
                  "class A { ['foo'] = function*() {} }":
                      "generator method 'foo'",
                  "class A { ['foo'] = async function() {} }":
                      "async method 'foo'",
                  "class A { [foo] = function() {} }": "method [foo]",
                  "class A { [foo] = () => {} }": "method [foo]",
                  "class A { [foo] = function*() {} }":
                      "generator method [foo]",
                  "class A { [foo] = async function() {} }":
                      "async method [foo]",
                  "class A { static foo = function() {} }":
                      "static method 'foo'",
                  "class A { static foo = () => {} }": "static method 'foo'",
                  "class A { static foo = function*() {} }":
                      "static generator method 'foo'",
                  "class A { static foo = async function() {} }":
                      "static async method 'foo'",
                  "class A { #foo = function() {} }": "private method #foo",
                  "class A { #foo = () => {} }": "private method #foo",
                  "class A { #foo = function*() {} }":
                      "private generator method #foo",
                  "class A { #foo = async function() {} }":
                      "private async method #foo",
                  "class A { static #foo = function() {} }":
                      "static private method #foo",
                  "class A { static #foo = () => {} }":
                      "static private method #foo",
                  "class A { static #foo = function*() {} }":
                      "static private generator method #foo",
                  "class A { static #foo = async function() {} }":
                      "static private async method #foo",
              }
            : {}),
    }

    for (var key of Object.keys(expectedResults)) {
        var expectedResult1 = expectedResults[key].replace(/\s+\[.+?\]/gu, "")
        var expectedResult2 = expectedResults[key]

        // it(`should return "${expectedResult1}" for "${key}".`, () => {
            var linter = new eslint.Linter()

            var actualResult = null
            linter.defineRule("test", () => ({
                ":function"(node) {
                    actualResult = getFunctionNameWithKind(node)
                },
            }))
            var messages = linter.verify(key, {
                rules: { test: "error" },
                parserOptions: {
                    ecmaVersion: semver.gte(eslint.Linter.version, "7.0.0")
                        ? 2022
                        : 2018,
                },
            })

        //     assert.strictEqual(
        //         messages.length,
        //         0,
        //         messages[0] && messages[0].message,
        //     )
        //     assert.strictEqual(actualResult, expectedResult1)
        // })

        // it(`should return "${expectedResult2}" for "${key}" if sourceCode is present.`, () => {
            var linter = new eslint.Linter()

            var actualResult = null
            linter.defineRule("test", (context) => ({
                ":function"(node) {
                    actualResult = getFunctionNameWithKind(
                        node,
                        context.getSourceCode(),
                    )
                },
            }))
            var messages = linter.verify(key, {
                rules: { test: "error" },
                parserOptions: {
                    ecmaVersion: semver.gte(eslint.Linter.version, "7.0.0")
                        ? 2022
                        : 2018,
                },
            })

    //         assert.strictEqual(
    //             messages.length,
    //             0,
    //             messages[0] && messages[0].message,
    //         )
    //         assert.strictEqual(actualResult, expectedResult2)
    //     })
    // }
// })
        }


         
var getPropertyName = require("eslint-utils").getPropertyName 
var getInnermostScope = require("eslint-utils").getInnermostScope
// describe("The 'getInnermostScope' function", () => {
    let i = 0
    for (var { code, parserOptions, selectNode, selectScope } of [
        {
            code: "let a = 0",
            parserOptions: {},
            selectNode: (node) => node,
            selectScope: (scope) => scope,
        },
        {
            code: "let a = 0",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            selectNode: (node) => node,
            selectScope: (scope) => scope.childScopes[0],
        },
        {
            code: "let a = 0",
            parserOptions: { sourceType: "module" },
            selectNode: (node) => node,
            selectScope: (scope) => scope.childScopes[0],
        },
        {
            code: "a; { b; { c; } d; } e;",
            parserOptions: {},
            selectNode: (node) => node.body[0],
            selectScope: (scope) => scope,
        },
        {
            code: "a; { b; { c; } d; } e;",
            parserOptions: {},
            selectNode: (node) => node.body[2],
            selectScope: (scope) => scope,
        },
        {
            code: "a; { b; { c; } d; } e;",
            parserOptions: {},
            selectNode: (node) => node.body[1].body[0],
            selectScope: (scope) => scope.childScopes[0],
        },
        {
            code: "a; { b; { c; } d; } e;",
            parserOptions: {},
            selectNode: (node) => node.body[1].body[2],
            selectScope: (scope) => scope.childScopes[0],
        },
        {
            code: "a; { b; { c; } d; } e;",
            parserOptions: {},
            selectNode: (node) => node.body[1].body[1].body[0],
            selectScope: (scope) => scope.childScopes[0].childScopes[0],
        },
    ]) {
        // it(`should return the innermost scope (${++i})`, () => {
            var linter = new eslint.Linter()

            let actualScope = null
            let expectedScope = null
            linter.defineRule("test", (context) => ({
                Program(node) {
                    var scope = context.getScope()
                    actualScope = getInnermostScope(scope, selectNode(node))
                    expectedScope = selectScope(scope)
                },
            }))
            linter.verify(code, {
                parserOptions: { ecmaVersion: 2018, ...parserOptions },
                rules: { test: "error" },
            })

            // assert.notStrictEqual(expectedScope, null)

            // assert.strictEqual makes tooooo large diff.
            // assert(actualScope === expectedScope)
        // })
    }
// })
// describe("The 'getPropertyName' function", () => {
    var getInnermostScope = require("eslint-utils").getInnermostScope
    for (var { code, expected } of [
        { code: "a.b", expected: "b" },
        { code: "a['b']", expected: "b" },
        { code: "a[`b`]", expected: "b" },
        { code: "a[100]", expected: "100" },
        { code: "a[b]", expected: null },
        { code: "a['a' + 'b']", expected: "ab" },
        { code: "a[tag`b`]", expected: null },
        { code: "a[`${b}`]", expected: null }, //eslint-disable-line no-template-curly-in-string
        { code: "({b: 1})", expected: "b" },
        { code: "({0x10: 1})", expected: "16" },
        { code: "({'foo': 1})", expected: "foo" },
        { code: "({b() {}})", expected: "b" },
        { code: "({get b() {}})", expected: "b" },
        { code: "({['b']: 1})", expected: "b" },
        { code: "({['b']() {}})", expected: "b" },
        { code: "({[`b`]: 1})", expected: "b" },
        { code: "({[100]: 1})", expected: "100" },
        { code: "({[b]: 1})", expected: null },
        { code: "({['a' + 'b']: 1})", expected: "ab" },
        { code: "({[tag`b`]: 1})", expected: null },
        { code: "({[`${b}`]: 1})", expected: null }, //eslint-disable-line no-template-curly-in-string
        { code: "(class {b() {}})", expected: "b" },
        { code: "(class {get b() {}})", expected: "b" },
        { code: "(class {['b']() {}})", expected: "b" },
        { code: "(class {[100]() {}})", expected: "100" },
        { code: "(class {[b]() {}})", expected: null },
        { code: "(class {['a' + 'b']() {}})", expected: "ab" },
        { code: "(class {[tag`b`]() {}})", expected: null },
        { code: "(class {[`${b}`]() {}})", expected: null }, //eslint-disable-line no-template-curly-in-string
        ...(semver.gte(eslint.Linter.version, "7.0.0")
            ? [
                  { code: "(class { x })", expected: "x" },
                  { code: "(class { static x })", expected: "x" },
                  { code: "(class { #x })", expected: null },
                  { code: "(class { get #x() {} })", expected: null },
                  { code: "(class { #x() {} })", expected: null },
                  { code: "(class { static #x })", expected: null },
                  { code: "(class { static get #x() {} })", expected: null },
                  { code: "(class { static #x() {} })", expected: null },
                  {
                      code: "(class { #x; fn() {this.#x} })",
                      expected: null,
                  },
                  {
                      code: "(class { #x; fn() {this.x} })",
                      expected: "x",
                  },
              ]
            : []),
    ]) {
        // it(`should return ${JSON.stringify(expected)} from ${code}`, () => {
            var linter = new eslint.Linter()

            let actual = null
            linter.defineRule("test", () => ({
                "Property,PropertyDefinition,MethodDefinition,MemberExpression"(
                    node,
                ) {
                    actual = getPropertyName(node)
                },
            }))
            var messages = linter.verify(code, {
                parserOptions: {
                    ecmaVersion: semver.gte(eslint.Linter.version, "7.0.0")
                        ? 2022
                        : 2018,
                },
                rules: { test: "error" },
            })
            // assert.strictEqual(
            //     messages.length,
            //     0,
            //     messages[0] && messages[0].message,
            // )
            // assert.strictEqual(actual, expected)
        // })
    }
// })

var getStaticValue  = require("eslint-utils").getStaticValue 
// describe("The 'getStaticValue' function", () => {
    for (var { code, expected, noScope = false } of [
        { code: "[]", expected: { value: [] } },
        { code: "[1, 2, 3]", expected: { value: [1, 2, 3] } },
        { code: "[,, 3]", expected: { value: [, , 3] } }, //eslint-disable-line no-sparse-arrays
        { code: "[1, ...[2, 3]]", expected: { value: [1, 2, 3] } },
        { code: "[0, a]", expected: null },
        { code: "[0, ...a]", expected: null },
        { code: "a = 1 + 2", expected: { value: 3 } },
        { code: "a += 1 + 2", expected: null },
        { code: "a in obj", expected: null },
        { code: "obj instanceof Object", expected: null },
        { code: "1 == '1'", expected: { value: true } },
        { code: "1 != '1'", expected: { value: false } },
        { code: "1 === '1'", expected: { value: false } },
        { code: "1 !== '1'", expected: { value: true } },
        { code: "1 < '1'", expected: { value: false } },
        { code: "1 <= '1'", expected: { value: true } },
        { code: "1 > '1'", expected: { value: false } },
        { code: "1 >= '1'", expected: { value: true } },
        { code: "1 << '1'", expected: { value: 2 } },
        { code: "1 >> '1'", expected: { value: 0 } },
        { code: "1 >>> '1'", expected: { value: 0 } },
        { code: "1 + '1'", expected: { value: "11" } },
        { code: "1 + 2", expected: { value: 3 } },
        { code: "1 - 2", expected: { value: -1 } },
        { code: "1 * 2", expected: { value: 2 } },
        { code: "1 / 2", expected: { value: 0.5 } },
        { code: "1 % 2", expected: { value: 1 } },
        { code: "2 ** 2", expected: { value: 4 } },
        { code: "1 | 2", expected: { value: 3 } },
        { code: "1 ^ 15", expected: { value: 14 } },
        { code: "3 & 2", expected: { value: 2 } },
        { code: "a + 1", expected: null },
        { code: "String(7)", expected: { value: "7" } },
        { code: "Math.round(0.7)", expected: { value: 1 } },
        { code: "Math['round'](0.4)", expected: { value: 0 } },
        { code: "foo(7)", expected: null },
        { code: "obj.foo(7)", expected: null },
        { code: "Math.round(a)", expected: null },
        { code: "true ? 1 : c", expected: { value: 1 } },
        { code: "false ? b : 2", expected: { value: 2 } },
        { code: "a ? 1 : 2", expected: null },
        { code: "true ? b : 2", expected: null },
        { code: "false ? 1 : c", expected: null },
        { code: "undefined", expected: { value: undefined } },
        { code: "var undefined; undefined", expected: null },
        { code: "var undefined = 1; undefined", expected: { value: 1 } },
        { code: "var a = 2; a", expected: { value: 2 } },
        { code: "let a = 2; a", expected: null },
        { code: "var a = 2; a", expected: null, noScope: true },
        { code: "var a = { b: 7 }; a.b", expected: { value: 7 } },
        { code: "null", expected: { value: null } },
        { code: "true", expected: { value: true } },
        { code: "false", expected: { value: false } },
        { code: "1", expected: { value: 1 } },
        { code: "'hello'", expected: { value: "hello" } },
        { code: "/foo/gu", expected: { value: /foo/gu } },
        { code: "true && 1", expected: { value: 1 } },
        { code: "false && a", expected: { value: false } },
        { code: "true || a", expected: { value: true } },
        { code: "false || 2", expected: { value: 2 } },
        { code: "true && a", expected: null },
        { code: "false || a", expected: null },
        { code: "a && 1", expected: null },
        { code: "Symbol.iterator", expected: { value: Symbol.iterator } },
        {
            code: "Symbol['iter' + 'ator']",
            expected: { value: Symbol.iterator },
        },
        { code: "Symbol[iterator]", expected: null },
        {
            code: "var symbol = Symbol(); (symbol === symbol)",
            expected: null,
        },
        { code: "Object.freeze", expected: { value: Object.freeze } },
        { code: "Object.xxx", expected: { value: undefined } },
        { code: "new Array(2)", expected: null },
        { code: "new Array(len)", expected: null },
        { code: "({})", expected: { value: {} } },
        {
            code: "({a: 1, b: 2, c: 3})",
            expected: { value: { a: 1, b: 2, c: 3 } },
        },
        {
            code: "var obj = {b: 2}; ({a: 1, ...obj})",
            expected: { value: { a: 1, b: 2 } },
        },
        { code: "var obj = {b: 2}; ({a: 1, ...obj})", expected: null },
        { code: "({ get a() {} })", expected: null },
        { code: "({ a })", expected: null },
        { code: "({ a: b })", expected: null },
        { code: "({ [a]: 1 })", expected: null },
        { code: "(a, b, 3)", expected: { value: 3 } },
        { code: "(1, b)", expected: null },
        { code: "`hello`", expected: { value: "hello" } },
        { code: "var ll = 'll'; `he${ll}o`", expected: { value: "hello" } }, //eslint-disable-line no-template-curly-in-string
        { code: "String.raw`\\unicode`", expected: { value: "\\unicode" } },
        { code: "`he${a}o`", expected: null }, //eslint-disable-line no-template-curly-in-string
        { code: "x`hello`", expected: null },
        { code: "-1", expected: { value: -1 } },
        { code: "+'1'", expected: { value: 1 } },
        { code: "!0", expected: { value: true } },
        { code: "~-1", expected: { value: 0 } },
        { code: "typeof 0", expected: { value: "number" } },
        { code: "void a.b", expected: { value: undefined } },
        { code: "+a", expected: null },
        { code: "delete a.b", expected: null },
        { code: "!function(){ return true }", expected: null },
        { code: "'' + Symbol()", expected: null },
        {
            code: `var eventName = "click"
var aMap = Object.freeze({
    click: 777
})
;\`on\${eventName} : \${aMap[eventName]}\``,
            expected: { value: "onclick : 777" },
        },
        {
            code: 'Function("return process.env.npm_name")()',
            expected: null,
        },
        {
            code: 'new Function("return process.env.npm_name")()',
            expected: null,
        },
        {
            code: '({}.varructor.varructor("return process.env.npm_name")())',
            expected: null,
        },
        {
            code: 'JSON.stringify({a:1}, new {}.varructor.varructor("console.log(\\"code injected\\"); process.exit(1)"), 2)',
            expected: null,
        },
        {
            code: 'Object.create(null, {a:{get:new {}.varructor.varructor("console.log(\\"code injected\\"); process.exit(1)")}}).a',
            expected: null,
        },
        {
            code: "RegExp.$1",
            expected: null,
        },
        ...(semver.gte(eslint.Linter.version, "6.0.0")
            ? [
                  {
                      code: "var a = null, b = 42; a ?? b",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = undefined, b = 42; a ?? b",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = false, b = 42; a ?? b",
                      expected: { value: false },
                  },
                  {
                      code: "var a = 42, b = null; a ?? b",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = 42, b = undefined; a ?? b",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = { b: { c: 42 } }; a?.b?.c",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = { b: { c: 42 } }; a?.b?.['c']",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = { b: null }; a?.b?.c",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = { b: undefined }; a?.b?.c",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = { b: null }; a?.b?.['c']",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = null; a?.b?.c",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = null; a?.b.c",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = void 0; a?.b.c",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = { b: { c: 42 } }; (a?.b).c",
                      expected: { value: 42 },
                  },
                  {
                      code: "var a = null; (a?.b).c",
                      expected: null,
                  },
                  {
                      code: "var a = { b: null }; (a?.b).c",
                      expected: null,
                  },
                  {
                      code: "var a = { b: { c: String } }; a?.b?.c?.(42)",
                      expected: { value: "42" },
                  },
                  {
                      code: "var a = null; a?.b?.c?.(42)",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = { b: { c: String } }; a?.b.c(42)",
                      expected: { value: "42" },
                  },
                  {
                      code: "var a = null; a?.b.c(42)",
                      expected: { value: undefined },
                  },
                  {
                      code: "null?.()",
                      expected: { value: undefined },
                  },
                  {
                      code: "var a = null; a?.()",
                      expected: { value: undefined },
                  },
                  {
                      code: "a?.()",
                      expected: null,
                  },
                  {
                      code: "({'a': 1, 1e+1: 2, 2n: 3})",
                      expected: { value: { a: 1, 10: 2, 2: 3 } },
                  },
              ]
            : []),
        ...(semver.gte(eslint.Linter.version, "7.0.0")
            ? [
                  {
                      code: `class A {
                          #x = 0;
                          fn () {
                              var foo = {x:42}
                              foo.#x // not 42
                          }
                      }`,
                      expected: null,
                  },
                  {
                      code: `class A {
                          #x = 0;
                          fn () {
                              var foo = {x:42}
                              foo.x // 42
                          }
                      }`,
                      expected: { value: 42 },
                  },
                  {
                      code: `class A {
                          #parseInt;
                          fn () {
                              Number.#parseInt('42') // not 42
                          }
                      }`,
                      expected: null,
                  },
                  {
                      code: `class A {
                          #parseInt;
                          fn () {
                              Number.parseInt('42') // 42
                          }
                      }`,
                      expected: { value: 42 },
                  },
              ]
            : []),
    ]) {
        // it(`should return ${JSON.stringify(expected)} from ${code}`, () => {
            var linter = new eslint.Linter()

            let actual = null
            linter.defineRule("test", (context) => ({
                ExpressionStatement(node) {
                    actual = getStaticValue(
                        node,
                        noScope ? null : context.getScope(),
                    )
                },
            }))
            var messages = linter.verify(code, {
                env: { es6: true },
                parserOptions: {
                    ecmaVersion: semver.gte(eslint.Linter.version, "7.0.0")
                        ? 2022
                        : semver.gte(eslint.Linter.version, "6.0.0")
                        ? 2020
                        : 2018,
                },
                rules: { test: "error" },
            })

            // assert.strictEqual(
            //     messages.length,
            //     0,
            //     messages[0] && messages[0].message,
            // )
            // if (actual == null) {
            //     assert.strictEqual(actual, expected)
            // } else {
            //     assert.deepStrictEqual(actual, expected)
            // }
        // })
    }
// })

var PatternMatcher = require("eslint-utils").PatternMatcher
var NAMED_CAPTURE_GROUP_SUPPORTED = (() => {
    try {
        new RegExp("(?<a>)", "u") //eslint-disable-line no-new, prefer-regex-literals
        return true
    } catch (_error) {
        return false
    }
})()

/**
 * Create a new RegExpExecArray.
 * @param {string[]} subStrings The substrings.
 * @param {number} index The index.
 * @param {string} input The input.
 * @returns {RegExpExecArray} The created object.
 */
function newRegExpExecArray(subStrings, index, input) {
    Object.assign(subStrings, { index, input })
    if (NAMED_CAPTURE_GROUP_SUPPORTED) {
        subStrings.groups = undefined
    }
    return subStrings
}

// describe("The 'PatternMatcher' class:", () => {
//     describe("the varructor", () => {
//         it("should throw TypeError if non-RegExp value was given.", () => {
            // for (var value of [
            //     undefined,
            //     null,
            //     1,
            //     "foo",
            //     () => {
            //         // empty
            //     },
            //     {
            //         exec() {
            //             // empty
            //         },
            //     },
            // ]) {
            //     new PatternMatcher(value)
                // assert.throws(
                //     () => new PatternMatcher(value),
                //     /^TypeError: 'pattern' should be a RegExp instance\.$/u,
                // )
            // }
        // })

        // it("should throw Error if the RegExp value does not have 'g' flag.", () => {
            // for (var value of [/foo/u, /bar/imu]) {
            //     new PatternMatcher(value)
                // assert.throws(
                //     () => new PatternMatcher(value),
                //     /^Error: 'pattern' should contains 'g' flag\.$/u,
                // )
            // }
    //     })
    // })

    // describe("the 'execAll' method", () => {
    //     describe("with no options", () => {
            for (var { str, expected } of [
                { str: "", expected: [] },
                { str: "abc", expected: [] },
                { str: String.raw`\foo`, expected: [] },
                { str: String.raw`\\\foo`, expected: [] },
                { str: String.raw`\a\foo`, expected: [] },
                {
                    str: "foo",
                    expected: [newRegExpExecArray(["foo"], 0, "foo")],
                },
                {
                    str: String.raw`\\foo`,
                    expected: [
                        newRegExpExecArray(["foo"], 2, String.raw`\\foo`),
                    ],
                },
                {
                    str: String.raw`\\\\foo`,
                    expected: [
                        newRegExpExecArray(["foo"], 4, String.raw`\\\\foo`),
                    ],
                },
                {
                    str: "-foofoofooabcfoo-",
                    expected: [
                        newRegExpExecArray(["foo"], 1, "-foofoofooabcfoo-"),
                        newRegExpExecArray(["foo"], 4, "-foofoofooabcfoo-"),
                        newRegExpExecArray(["foo"], 7, "-foofoofooabcfoo-"),
                        newRegExpExecArray(["foo"], 13, "-foofoofooabcfoo-"),
                    ],
                },
                {
                    str: String.raw`-foo\foofooabcfoo-`,
                    expected: [
                        newRegExpExecArray(
                            ["foo"],
                            1,
                            String.raw`-foo\foofooabcfoo-`,
                        ),
                        newRegExpExecArray(
                            ["foo"],
                            8,
                            String.raw`-foo\foofooabcfoo-`,
                        ),
                        newRegExpExecArray(
                            ["foo"],
                            14,
                            String.raw`-foo\foofooabcfoo-`,
                        ),
                    ],
                },
            ]) {
                // it(`should return ${JSON.stringify(
                //     expected,
                // )} in ${JSON.stringify(str)}.`, () => {
                    var matcher = new PatternMatcher(/foo/gu)
                    var actual = Array.from(matcher.execAll(str))
                    // assert.deepStrictEqual(actual, expected)
                // })
            }

            for (var { str, expected } of [
                {
                    str: "ab0c",
                    expected: [newRegExpExecArray(["b0", "b", "0"], 1, "ab0c")],
                },
                {
                    str: "a1b2c3",
                    expected: [
                        newRegExpExecArray(["a1", "a", "1"], 0, "a1b2c3"),
                        newRegExpExecArray(["b2", "b", "2"], 2, "a1b2c3"),
                        newRegExpExecArray(["c3", "c", "3"], 4, "a1b2c3"),
                    ],
                },
            ]) {
                // it(`should return ${JSON.stringify(
                //     expected,
                // )} in ${JSON.stringify(str)}.`, () => {
                    var matcher = new PatternMatcher(/(\w)(\d)/gu)
                    var actual = Array.from(matcher.execAll(str))
                    // assert.deepStrictEqual(actual, expected)
                // })
            }

            // it("should iterate for two strings in parallel.", () => {
                var matcher = new PatternMatcher(/\w/gu)
                var expected1 = [
                    newRegExpExecArray(["a"], 0, "a--b-c"),
                    newRegExpExecArray(["b"], 3, "a--b-c"),
                    newRegExpExecArray(["c"], 5, "a--b-c"),
                ]
                var expected2 = [
                    newRegExpExecArray(["a"], 1, "-ab-c-"),
                    newRegExpExecArray(["b"], 2, "-ab-c-"),
                    newRegExpExecArray(["c"], 4, "-ab-c-"),
                ]
                var actual1 = []
                var actual2 = []
                var it1 = matcher.execAll("a--b-c")
                var it2 = matcher.execAll("-ab-c-")
                {
                    let ret1 = null
                    let ret2 = null
                    while (
                        ((ret1 = it1.next()),
                        (ret2 = it2.next()),
                        !ret1.done && !ret2.done)
                    ) {
                        actual1.push(ret1.value)
                        actual2.push(ret2.value)
                    }
                }

        //         assert.deepStrictEqual(actual1, expected1)
        //         assert.deepStrictEqual(actual2, expected2)
        //     })
        // })

        // describe("with 'escaped:true' option", () => {
            for (var { str, expected } of [
                {
                    str: "foo",
                    expected: [newRegExpExecArray(["foo"], 0, "foo")],
                },
                {
                    str: String.raw`\foo`,
                    expected: [
                        newRegExpExecArray(["foo"], 1, String.raw`\foo`),
                    ],
                },
                {
                    str: String.raw`\\foo`,
                    expected: [
                        newRegExpExecArray(["foo"], 2, String.raw`\\foo`),
                    ],
                },
                {
                    str: String.raw`\\\foo`,
                    expected: [
                        newRegExpExecArray(["foo"], 3, String.raw`\\\foo`),
                    ],
                },
                {
                    str: String.raw`\\\\foo`,
                    expected: [
                        newRegExpExecArray(["foo"], 4, String.raw`\\\\foo`),
                    ],
                },
            ]) {
                // it(`should return ${JSON.stringify(
                //     expected,
                // )} in ${JSON.stringify(str)}.`, () => {
                    var matcher = new PatternMatcher(/foo/gu, {
                        escaped: true,
                    })
                    var actual = Array.from(matcher.execAll(str))
                //     assert.deepStrictEqual(actual, expected)
                // })
            }
    //     })
    // })

    // describe("the 'test' method", () => {
        for (var { str, expected } of [
            { str: "", expected: false },
            { str: "abc", expected: false },
            { str: String.raw`\foo`, expected: false },
            { str: String.raw`\\\foo`, expected: false },
            { str: String.raw`\a\foo`, expected: false },
            { str: String.raw`-\foo\foo\fooabc\foo-`, expected: false },
            { str: "foo", expected: true },
            { str: String.raw`\\foo`, expected: true },
            { str: String.raw`\\\\foo`, expected: true },
            { str: "-foofoofooabcfoo-", expected: true },
            { str: String.raw`-foo\foofooabcfoo-`, expected: true },
        ]) {
            // it(`should return ${expected} in ${JSON.stringify(str)}.`, () => {
                var matcher = new PatternMatcher(/foo/gu)
                var actual = matcher.test(str)
            //     assert.deepStrictEqual(actual, expected)
            // })
        }
    // })

    // describe("the 'Symbol.replace' method", () => {
        for (var { pattern, str, replacer, expected } of [
            { str: "", replacer: "xyz", expected: "" },
            { str: "123", replacer: "xyz", expected: "123" },
            {
                str: String.raw`1\a2\b3`,
                replacer: "x",
                expected: String.raw`1\a2\b3`,
            },
            {
                str: String.raw`1a2\b3`,
                replacer: "x",
                expected: String.raw`1x2\b3`,
            },
            {
                str: String.raw`1a2b3`,
                replacer: "x",
                expected: String.raw`1x2x3`,
            },
            { str: "abc", replacer: "x", expected: "xxx" },
            { str: "abc", replacer: "$$x", expected: "$x$x$x" },
            { str: "abc", replacer: "$$&", expected: "$&$&$&" },
            { str: "abc", replacer: "$$$&", expected: "$a$b$c" },
            { str: "abc", replacer: "$&", expected: "abc" },
            { str: "abc", replacer: "$'$`", expected: "bccaab" },
            {
                str: String.raw`a\bc`,
                replacer: "$'$`",
                expected: String.raw`\bc\ba\b`,
            },
            { str: "abc", replacer: "$0", expected: "$0$0$0" },
            { str: "abc", replacer: "$1", expected: "$1$1$1" },
            {
                pattern: /a(b)/gu,
                str: "abc",
                replacer: "$1",
                expected: "bc",
            },
        ]) {
            // it(`should return ${expected} in ${JSON.stringify(
            //     str,
            // )} and ${JSON.stringify(replacer)}.`, () => {
                var matcher = new PatternMatcher(pattern || /[a-c]/gu)
                var actual = str.replace(matcher, replacer)
            //     assert.deepStrictEqual(actual, expected)
            // })
        }

        // it("should pass the correct arguments to replacers.", () => {
//             var matcher = new PatternMatcher(/(\w)(\d)/gu)
//             var actualArgs = []
//             var actual = "abc1d2efg".replace(matcher, (...args) => {
//                 actualArgs.push(args)
//                 return "x"
//             })

//             assert.deepStrictEqual(actualArgs, [
//                 ["c1", "c", "1", 2, "abc1d2efg"],
//                 ["d2", "d", "2", 4, "abc1d2efg"],
//             ])
//             assert.deepStrictEqual(actual, "abxxefg")
//         })
//     })
// })


var { CALL, CONSTRUCT, ESM, READ, ReferenceTracker } = require("eslint-utils")
const config = {
    parserOptions: {
        ecmaVersion: semver.gte(eslint.Linter.version, "7.0.0")
            ? 2022
            : semver.gte(eslint.Linter.version, "6.0.0")
            ? 2020
            : 2018,
        sourceType: "module",
    },
    globals: { Reflect: false },
    rules: { test: "error" },
}

// describe("The 'ReferenceTracker' class:", () => {
//     describe("the 'iterateGlobalReferences' method", () => {
        for (const { description, code, traceMap, expected } of [
            {
                description:
                    "should iterate the references of a given global variable.",
                code: "var x = Object; { let Object; var y = Object }",
                traceMap: {
                    Object: {
                        [READ]: 1,
                        foo: { [CALL]: 2 },
                        Foo: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "Identifier" },
                        path: ["Object"],
                        type: READ,
                        info: 1,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with MemberExpression",
                code: [
                    "Object.a; Object.a(); new Object.a();",
                    "Object.b; Object.b(); new Object.b();",
                    "Object.c; Object.c(); new Object.c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with VariableDeclarator",
                code: [
                    "var x = Object;",
                    "x.a; x.a(); new x.a();",
                    "x.b; x.b(); new x.b();",
                    "x.c; x.c(); new x.c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with VariableDeclarator 2",
                code: [
                    "var x = Object, a = x.a, b = x.b, c = x.c;",
                    "a; a(); new a();",
                    "b; b(); new b();",
                    "c; c(); new c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with AssignmentExpression",
                code: [
                    "var x, a, b, c;",
                    "a = (x = Object).a; b = x.b; c = x.c;",
                    "a; a(); new a();",
                    "b; b(); new b();",
                    "c; c(); new c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with destructuring",
                code: [
                    "var {a, b, c} = Object;",
                    "a; a(); new a();",
                    "b; b(); new b();",
                    "c; c(); new c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "Property" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with AssignmentPattern",
                code: [
                    "var {x: {a, b, c} = Object} = {};",
                    "a; a(); new a();",
                    "b; b(); new b();",
                    "c; c(); new c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "Property" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with 'window'.",
                code: [
                    "/*global window */",
                    "var {Object: {a, b, c}} = window;",
                    "a; a(); new a();",
                    "b; b(); new b();",
                    "c; c(); new c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "Property" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with 'global'.",
                code: [
                    "/*global global */",
                    "global.Object.a;",
                    "global.Object.b; global.Object.b(); new global.Object.b();",
                    "global.Object.c; global.Object.c(); new global.Object.c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with 'globalThis'.",
                code: [
                    "/*global globalThis */",
                    "globalThis.Object.a;",
                    "globalThis.Object.b; globalThis.Object.b(); new globalThis.Object.b();",
                    "globalThis.Object.c; globalThis.Object.c(); new globalThis.Object.c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with 'self'.",
                code: [
                    "/*global self */",
                    "self.Object.a;",
                    "self.Object.b; self.Object.b(); new self.Object.b();",
                    "self.Object.c; self.Object.c(); new self.Object.c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the member references of a given global variable, with 'window'.",
                code: [
                    "/*global window */",
                    "window.Object.a;",
                    "window.Object.b; window.Object.b(); new window.Object.b();",
                    "window.Object.c; window.Object.c(); new window.Object.c();",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["Object", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["Object", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["Object", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should not iterate the references of a given global variable if it's modified.",
                code: [
                    "Object = {}",
                    "Object.a",
                    "Object.b()",
                    "new Object.c()",
                ].join("\n"),
                traceMap: {
                    Object: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [],
            },
            {
                description:
                    "should not iterate the references through unary/binary expressions.",
                code: [
                    'var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined',
                    "construct()",
                ].join("\n"),
                traceMap: {
                    Reflect: { [CALL]: 1 },
                },
                expected: [],
            },
            ...(semver.gte(eslint.Linter.version, "7.0.0")
                ? [
                      {
                          description:
                              "should not mix up public and private identifiers.",
                          code: [
                              "class C { #value; wrap() { var value = MyObj.#value; } }",
                          ].join("\n"),
                          traceMap: {
                              MyObj: {
                                  value: { [READ]: 1 },
                              },
                          },
                          expected: [],
                      },
                  ]
                : []),
        ]) {
            // it(description, () => {
                const linter = new eslint.Linter()

                let actual = null
                linter.defineRule("test", (context) => ({
                    "Program:exit"() {
                        const tracker = new ReferenceTracker(context.getScope())
                        actual = Array.from(
                            tracker.iterateGlobalReferences(traceMap),
                        ).map((x) =>
                            Object.assign(x, {
                                node: {
                                    type: x.node.type,
                                    ...(x.node.optional
                                        ? { optional: x.node.optional }
                                        : {}),
                                },
                            }),
                        )
                    },
                }))
                linter.verify(code, config)

            //     assert.deepStrictEqual(actual, expected)
            // })
        }
    // })

    // describe("the 'iterateCjsReferences' method", () => {
        for (const { description, code, traceMap, expected } of [
            {
                description:
                    "should iterate the references of a given CJS modules.",
                code: [
                    "/*global require */",
                    "const abc = require('abc');",
                    "abc();",
                    "new abc();",
                    "abc.xyz;",
                    ...(semver.gte(eslint.Linter.version, "6.0.0")
                        ? [
                              "abc?.xyz;",
                              "abc?.();",
                              "abc?.xyz?.();",
                              "(abc.def).ghi;",
                              "(abc?.def)?.ghi;",
                          ]
                        : []),
                ].join("\n"),
                traceMap: {
                    abc: {
                        [READ]: 1,
                        [CALL]: 2,
                        [CONSTRUCT]: 3,
                        xyz: { [READ]: 4 },
                        def: { ghi: { [READ]: 5 } },
                    },
                },
                expected: [
                    {
                        node: { type: "CallExpression" },
                        path: ["abc"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["abc"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["abc"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["abc", "xyz"],
                        type: READ,
                        info: 4,
                    },
                    ...(semver.gte(eslint.Linter.version, "6.0.0")
                        ? [
                              {
                                  node: {
                                      type: "MemberExpression",
                                      optional: true,
                                  },
                                  path: ["abc", "xyz"],
                                  type: READ,
                                  info: 4,
                              },
                              {
                                  node: {
                                      type: "CallExpression",
                                      optional: true,
                                  },
                                  path: ["abc"],
                                  type: CALL,
                                  info: 2,
                              },
                              {
                                  node: {
                                      type: "MemberExpression",
                                      optional: true,
                                  },
                                  path: ["abc", "xyz"],
                                  type: READ,
                                  info: 4,
                              },
                              {
                                  node: { type: "MemberExpression" },
                                  path: ["abc", "def", "ghi"],
                                  type: READ,
                                  info: 5,
                              },
                              {
                                  node: {
                                      type: "MemberExpression",
                                      optional: true,
                                  },
                                  path: ["abc", "def", "ghi"],
                                  type: READ,
                                  info: 5,
                              },
                          ]
                        : []),
                ],
            },
            {
                description:
                    "should NOT iterate the references of a given CJS modules if the 'require' variable wasn't defined.",
                code: [
                    "const abc = require('abc');",
                    "abc();",
                    "new abc();",
                    "abc.xyz;",
                ].join("\n"),
                traceMap: {
                    abc: {
                        [READ]: 1,
                        [CALL]: 2,
                        [CONSTRUCT]: 3,
                        xyz: { [READ]: 4 },
                    },
                },
                expected: [],
            },
            {
                description:
                    "should NOT iterate the references of a given CJS modules if the 'require' variable was overrided.",
                code: [
                    "/*global require */",
                    "const require = () => {};",
                    "const abc = require('abc');",
                    "abc();",
                    "new abc();",
                    "abc.xyz;",
                ].join("\n"),
                traceMap: {
                    abc: {
                        [READ]: 1,
                        [CALL]: 2,
                        [CONSTRUCT]: 3,
                        xyz: { [READ]: 4 },
                    },
                },
                expected: [],
            },
        ]) {
            // it(description, () => {
                const linter = new eslint.Linter()

                let actual = null
                linter.defineRule("test", (context) => ({
                    "Program:exit"() {
                        const tracker = new ReferenceTracker(context.getScope())
                        actual = Array.from(
                            tracker.iterateCjsReferences(traceMap),
                        ).map((x) =>
                            Object.assign(x, {
                                node: {
                                    type: x.node.type,
                                    ...(x.node.optional
                                        ? { optional: x.node.optional }
                                        : {}),
                                },
                            }),
                        )
                    },
                }))
                linter.verify(code, config)

                assert.deepStrictEqual(actual, expected)
            // })
        }
    // })

    // describe("the 'iterateEsmReferences' method", () => {
        for (const { description, code, traceMap, expected } of [
            {
                description:
                    "should iterate the references of a given ES modules (with CJS module and the default export).",
                code: [
                    "import abc from 'abc';",
                    "abc();",
                    "new abc();",
                    "abc.xyz;",
                ].join("\n"),
                traceMap: {
                    abc: {
                        [READ]: 1,
                        [CALL]: 2,
                        [CONSTRUCT]: 3,
                        xyz: { [READ]: 4 },
                    },
                },
                expected: [
                    {
                        node: { type: "ImportDeclaration" },
                        path: ["abc"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["abc"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["abc"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["abc", "xyz"],
                        type: READ,
                        info: 4,
                    },
                ],
            },
            {
                description: "should map CJS module to the default export.",
                code: [
                    "import {default as x} from 'abc';",
                    "x.a;",
                    "x.b();",
                    "new x.c();",
                ].join("\n"),
                traceMap: {
                    abc: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["abc", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["abc", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["abc", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description: "should NOT map CJS module to the named exports.",
                code: [
                    "import {a, b, c} from 'abc';",
                    "a;",
                    "b();",
                    "new c();",
                ].join("\n"),
                traceMap: {
                    abc: {
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [],
            },
            {
                description:
                    "should iterate the references of a given ES modules.",
                code: [
                    "import x, {a, b, c, y} from 'abc';",
                    "x.a;",
                    "x.y;",
                    "a;",
                    "b();",
                    "new c();",
                ].join("\n"),
                traceMap: {
                    abc: {
                        [ESM]: true,
                        default: {
                            y: { [READ]: 4 },
                        },
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["abc", "default", "y"],
                        type: READ,
                        info: 4,
                    },
                    {
                        node: { type: "ImportSpecifier" },
                        path: ["abc", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["abc", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["abc", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the references of a given ES modules, with ImportNamespaceSpecifier.",
                code: [
                    "import * as x from 'abc';",
                    "x.default.a;",
                    "x.default.y;",
                    "x.a;",
                    "x.b();",
                    "new x.c();",
                ].join("\n"),
                traceMap: {
                    abc: {
                        [ESM]: true,
                        default: {
                            y: { [READ]: 4 },
                        },
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                    },
                },
                expected: [
                    {
                        node: { type: "MemberExpression" },
                        path: ["abc", "default", "y"],
                        type: READ,
                        info: 4,
                    },
                    {
                        node: { type: "MemberExpression" },
                        path: ["abc", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "CallExpression" },
                        path: ["abc", "b"],
                        type: CALL,
                        info: 2,
                    },
                    {
                        node: { type: "NewExpression" },
                        path: ["abc", "c"],
                        type: CONSTRUCT,
                        info: 3,
                    },
                ],
            },
            {
                description:
                    "should iterate the references of a given ES modules, with ExportNamedDeclaration.",
                code: "export {a, b, c} from 'abc';",
                traceMap: {
                    abc: {
                        [ESM]: true,
                        default: {
                            y: { [READ]: 4 },
                        },
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                        d: { [READ]: 5 },
                    },
                },
                expected: [
                    {
                        node: { type: "ExportSpecifier" },
                        path: ["abc", "a"],
                        type: READ,
                        info: 1,
                    },
                ],
            },
            {
                description:
                    "should iterate the references of a given ES modules, with ExportAllDeclaration.",
                code: "export * from 'abc';",
                traceMap: {
                    abc: {
                        [ESM]: true,
                        default: {
                            y: { [READ]: 4 },
                        },
                        a: { [READ]: 1 },
                        b: { [CALL]: 2 },
                        c: { [CONSTRUCT]: 3 },
                        d: { [READ]: 5 },
                    },
                },
                expected: [
                    {
                        node: { type: "ExportAllDeclaration" },
                        path: ["abc", "a"],
                        type: READ,
                        info: 1,
                    },
                    {
                        node: { type: "ExportAllDeclaration" },
                        path: ["abc", "d"],
                        type: READ,
                        info: 5,
                    },
                ],
            },
        ]) {
            // it(description, () => {
                const linter = new eslint.Linter()

                let actual = null
                linter.defineRule("test", (context) => ({
                    "Program:exit"() {
                        const tracker = new ReferenceTracker(context.getScope())
                        actual = Array.from(
                            tracker.iterateEsmReferences(traceMap),
                        ).map((x) =>
                            Object.assign(x, {
                                node: {
                                    type: x.node.type,
                                    ...(x.node.optional
                                        ? { optional: x.node.optional }
                                        : {}),
                                },
                            }),
                        )
                    },
                }))
                linter.verify(code, config)

                assert.deepStrictEqual(actual, expected)
            // })
        }
//     })
// })

// import assert from "assert"
var {
    isArrowToken,
    isClosingBraceToken,
    isClosingBracketToken,
    isClosingParenToken,
    isColonToken,
    isCommaToken,
    isCommentToken,
    isNotArrowToken,
    isNotClosingBraceToken,
    isNotClosingBracketToken,
    isNotClosingParenToken,
    isNotColonToken,
    isNotCommaToken,
    isNotCommentToken,
    isNotOpeningBraceToken,
    isNotOpeningBracketToken,
    isNotOpeningParenToken,
    isNotSemicolonToken,
    isOpeningBraceToken,
    isOpeningBracketToken,
    isOpeningParenToken,
    isSemicolonToken,
} = require("eslint-utils")

// describe("The predicate functions for tokens", () => {
    for (const { positive, negative, patterns } of [
        {
            positive: isArrowToken,
            negative: isNotArrowToken,
            patterns: [
                [{ type: "Punctuator", value: "=>" }, true],
                [{ type: "Punctuator", value: ">" }, false],
                [{ type: "Line", value: "=>" }, false],
            ],
        },
        {
            positive: isClosingBraceToken,
            negative: isNotClosingBraceToken,
            patterns: [
                [{ type: "Punctuator", value: "}" }, true],
                [{ type: "Punctuator", value: "{" }, false],
                [{ type: "Punctuator", value: ")" }, false],
                [{ type: "Line", value: "}" }, false],
            ],
        },
        {
            positive: isClosingBracketToken,
            negative: isNotClosingBracketToken,
            patterns: [
                [{ type: "Punctuator", value: "]" }, true],
                [{ type: "Punctuator", value: "[" }, false],
                [{ type: "Punctuator", value: ")" }, false],
                [{ type: "Line", value: "]" }, false],
            ],
        },
        {
            positive: isClosingParenToken,
            negative: isNotClosingParenToken,
            patterns: [
                [{ type: "Punctuator", value: ")" }, true],
                [{ type: "Punctuator", value: "(" }, false],
                [{ type: "Punctuator", value: "}" }, false],
                [{ type: "Line", value: ")" }, false],
            ],
        },
        {
            positive: isColonToken,
            negative: isNotColonToken,
            patterns: [
                [{ type: "Punctuator", value: ":" }, true],
                [{ type: "Punctuator", value: ";" }, false],
                [{ type: "Line", value: ":" }, false],
            ],
        },
        {
            positive: isCommaToken,
            negative: isNotCommaToken,
            patterns: [
                [{ type: "Punctuator", value: "," }, true],
                [{ type: "Punctuator", value: "." }, false],
                [{ type: "Line", value: "," }, false],
            ],
        },
        {
            positive: isCommentToken,
            negative: isNotCommentToken,
            patterns: [
                [{ type: "Line", value: "." }, true],
                [{ type: "Block", value: "." }, true],
                [{ type: "Shebang", value: "." }, true],
                [{ type: "Punctuator", value: "." }, false],
            ],
        },
        {
            positive: isOpeningBraceToken,
            negative: isNotOpeningBraceToken,
            patterns: [
                [{ type: "Punctuator", value: "{" }, true],
                [{ type: "Punctuator", value: "(" }, false],
                [{ type: "Punctuator", value: "}" }, false],
                [{ type: "Line", value: "{" }, false],
            ],
        },
        {
            positive: isOpeningBracketToken,
            negative: isNotOpeningBracketToken,
            patterns: [
                [{ type: "Punctuator", value: "[" }, true],
                [{ type: "Punctuator", value: "(" }, false],
                [{ type: "Punctuator", value: "]" }, false],
                [{ type: "Line", value: "[" }, false],
            ],
        },
        {
            positive: isOpeningParenToken,
            negative: isNotOpeningParenToken,
            patterns: [
                [{ type: "Punctuator", value: "(" }, true],
                [{ type: "Punctuator", value: "{" }, false],
                [{ type: "Punctuator", value: ")" }, false],
                [{ type: "Line", value: "(" }, false],
            ],
        },
        {
            positive: isSemicolonToken,
            negative: isNotSemicolonToken,
            patterns: [
                [{ type: "Punctuator", value: ";" }, true],
                [{ type: "Punctuator", value: ":" }, false],
                [{ type: "Line", value: ";" }, false],
            ],
        },
    ]) {
        const baseName = positive.name.slice(2)

        // describe(`'is${baseName}'`, () => {
            for (const [token, expected] of patterns) {
                // it(`should return ${expected} if ${JSON.stringify(
                //     token,
                // )} was given.`, () => {
                    assert.strictEqual(positive(token), expected)
                // })
            }
        // })

        // describe(`'isNot${baseName}'`, () => {
            for (const [token, expected] of patterns) {
                // it(`should return ${!expected} if ${JSON.stringify(
                //     token,
                // )} was given.`, () => {
                    assert.strictEqual(negative(token), !expected)
                // })
            }
        // })
    }
// })
