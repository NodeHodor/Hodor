var getPropertyName = require("eslint-utils").getPropertyName;
var eslint = require("eslint");

for (const { code, expected } of [
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
]) {
    try{
    const linter = new eslint.Linter()

    let actual = null
    linter.defineRule("test", () => ({
        "Property,PropertyDefinition,MethodDefinition,MemberExpression"(
            node
        ) {
            actual = getPropertyName(node)
        },
    }))
    const messages = linter.verify(code, {
        parserOptions: {
        },
        rules: { test: "error" },
    })
    }catch(err){

    }
    
}
