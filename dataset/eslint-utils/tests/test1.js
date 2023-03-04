var findVariable = require("eslint-utils").findVariable;
var eslint = require("eslint");

function getVariable(code, selector, withString = null) {
    const linter = new eslint.Linter()
    let variable = null

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
    "let a; foo(a)",
    "CallExpression Identifier[name='a']"
)

getVariable(
    "let a; if (b) { foo(a) }",
    "CallExpression Identifier[name='a']"
)

getVariable(
    "let a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']"
)

getVariable(
    "let a; foo(a)",
    "CallExpression Identifier[name='a']",
    "a"
)

getVariable(
    "let a; if (b) { foo(a) }",
    "CallExpression Identifier[name='a']",
    "a"
)

getVariable(
    "let a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']",
    "a"
)

getVariable(
    "let a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']",
    "Object"
)

getVariable(
    "let a; function f() { foo(a) }",
    "CallExpression Identifier[name='a']",
    "x"
)
