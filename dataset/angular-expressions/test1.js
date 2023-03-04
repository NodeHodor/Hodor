var expressions = require("angular-expressions");
expressions.Parser

var parser = new expressions.Parser(undefined, undefined, {});
parser.parse


var scope = {
    ship: {
        pirate: {
            name: "Jenny"
        }
    }
};
var evaluate;

var expressions = require("angular-expressions");
var compile = expressions.compile;

compile("")
compile("tmp").ast


evaluate = compile("null");
evaluate = compile("true");
evaluate = compile("false");
evaluate = compile("2.34e5");
evaluate = compile("'string'");
evaluate = compile("[ship, 1, 2, []]");
evaluate = compile("{ test: 'value', 'new-object': {} }");

evaluate = compile("ship");
evaluate = compile("notDefined");
evaluate = compile("this");
evaluate = compile("newValue = 'new'");
evaluate = compile("ship = 'ship'");
evaluate = compile("ship.pirate.name");
evaluate = compile("island.pirate.name");
evaluate = compile("island.pirate.name = 'Störtebeker'");
evaluate = compile("ship.pirate.name = 'Störtebeker'");

scope.ships = [
    { pirate: "Jenny" },
    { pirate: "Störtebeker" }
];
evaluate = compile("ships[1].pirate");
evaluate = compile("ships[2].pirate");

scope.ships = [
    { pirate: "Jenny" }
];
evaluate = compile("ships[0].pirate = 'Störtebeker'");


scope.findPirate = function () {
    return scope.ship.pirate;
};
evaluate = compile("findPirate()");

scope.returnThis = function () {
    return this;
};
evaluate = compile("returnThis()");

scope.ship.returnThis = function () {
    return this;
};
evaluate = compile("ship.returnThis()");

scope.findPirate = function (pirate) {
    return Array.prototype.slice.call(arguments);
};
evaluate = compile("findPirate(ship.pirate, 1, [2, 3])");
evaluate = compile("1 + 1");
evaluate = compile("1 - 1");
evaluate = compile("2 * 2");
evaluate = compile("4 / 2");
evaluate = compile("3 % 2");
evaluate = compile("true && true");
evaluate = compile("true && false");
evaluate = compile("false && false");
evaluate = compile("true || true");
evaluate = compile("true || false");
evaluate = compile("false || false");
evaluate = compile("!true");
evaluate = compile("!false");
evaluate = compile("true? 'it works' : false");
evaluate = compile("false? false : 'it works'");


scope.ships = [
    { pirate: function (str) { return str; } },
    { pirate: function (str) { return str; } }
];
scope.index = 0;
scope.pi = "pi";
scope.Jenny = "Jenny";
evaluate = compile("ships[index][pi + 'rate'](Jenny)");
    

expressions.filters.currency = function (input, currency, digits) {
    input = input.toFixed(digits);

    if (currency === "EUR") {
        return input + "€";
    }
    return input + "$";
};

evaluate = compile("1.2345 | currency:selectedCurrency:2");

compile("a")

scope = {};
var fn = compile("a");
fn.assign(scope, 123);
scope.a

scope = {};
var fn = compile("a.b[\'c\']");
fn.assign(scope, 123);

scope = {};
var fn = compile("a[\"b\"].c");
fn.assign(scope, 123);

scope = {};
var fn = compile("a[\"b\"].c");
fn.assign(scope, 123);

scope = {};
var fn = compile("a[\"b\"].c");
compile.cache

var fn = compile("a");
compile.cache.a;

compile.cache = false;
compile("a");
compile.cache = {};

var expressions = require("angular-expressions");
var compile = expressions.compile;


expressions.Lexer
var lexer = new expressions.Lexer();
lexer.lex

expressions.Parser
var parser = new expressions.Parser(undefined, undefined, {});
parser.parse

var scope;
var evaluate;

scope = {
    ship: {
        pirate: {
            name: "Jenny"
        }
    }
};
compile("")
compile("tmp").ast
evaluate = compile("null");
evaluate(scope)
evaluate = compile("true");
evaluate(scope)
evaluate = compile("false");
evaluate(scope)
evaluate = compile("2.34e5");
evaluate(scope)
evaluate = compile("'string'");
evaluate(scope)
evaluate = compile("[ship, 1, 2, []]");
evaluate(scope)
evaluate = compile("{ test: 'value', 'new-object': {} }");
evaluate(scope)
evaluate = compile("ship");
evaluate(scope)
evaluate = compile("notDefined");
evaluate(scope)
evaluate = compile("this");
evaluate(scope)
evaluate = compile("newValue = 'new'");
evaluate(scope);
scope.newValue
evaluate = compile("ship = 'ship'");
evaluate(scope);

evaluate = compile("ship.pirate.name");
evaluate(scope)
evaluate = compile("island.pirate.name");
evaluate(scope)
evaluate = compile("island.pirate.name = 'Störtebeker'");
// evaluate(scope);
// scope.island.pirate.name
// evaluate = compile("ship.pirate.name = 'Störtebeker'");
// evaluate(scope);


//         describe("when evaluating array look-ups", function () {

//             beforeEach(function () {
//                 scope.ships = [
//                     { pirate: "Jenny" },
//                     { pirate: "Störtebeker" }
//                 ];
//             });

//             it("should return the value if its defined on scope", function () {
//                 evaluate = compile("ships[1].pirate");
//                 expect(evaluate(scope)).to.equal("Störtebeker");
//             });

//             it("should return undefined instead of throwing a ReferenceError if it's not defined on scope", function () {
//                 evaluate = compile("ships[2].pirate");
//                 expect(evaluate(scope)).to.equal(undefined);
//             });

//         });

//         describe("when evaluating array assignments", function () {

//             it("should change the value if its defined on scope", function () {
//                 scope.ships = [
//                     { pirate: "Jenny" }
//                 ];
//                 evaluate = compile("ships[0].pirate = 'Störtebeker'");
//                 evaluate(scope);
//                 expect(scope.ships[0].pirate).to.equal("Störtebeker");
//             });

//         });

//         describe("when evaluating function calls", function () {

//             describe("using no arguments", function () {

//                 it("should return the function's return value", function () {
//                     scope.findPirate = function () {
//                         return scope.ship.pirate;
//                     };

//                     evaluate = compile("findPirate()");
//                     expect(evaluate(scope)).to.equal(scope.ship.pirate);
//                 });

//                 it("should call the function on the scope", function () {
//                     scope.returnThis = function () {
//                         return this;
//                     };
//                     evaluate = compile("returnThis()");
//                     expect(evaluate(scope)).to.equal(scope);
//                 });

//                 it("should call the function on the object where it is defined", function () {
//                     scope.ship.returnThis = function () {
//                         return this;
//                     };
//                     evaluate = compile("ship.returnThis()");
//                     expect(evaluate(scope)).to.equal(scope.ship);
//                 });

//             });

//             describe("using arguments", function () {

//                 it("should parse the arguments accordingly", function () {
//                     scope.findPirate = function (pirate) {
//                         return Array.prototype.slice.call(arguments);
//                     };
//                     evaluate = compile("findPirate(ship.pirate, 1, [2, 3])");
//                     expect(evaluate(scope)).to.eql([scope.ship.pirate, 1, [2, 3]]);
//                 });

//             });

//         });

//         describe("when evaluating operators", function () {

//             it("should return the expected result when using +", function () {
//                 evaluate = compile("1 + 1");
//                 expect(evaluate()).to.equal(2);
//             });

//             it("should return the expected result when using -", function () {
//                 evaluate = compile("1 - 1");
//                 expect(evaluate()).to.equal(0);
//             });

//             it("should return the expected result when using *", function () {
//                 evaluate = compile("2 * 2");
//                 expect(evaluate()).to.equal(4);
//             });

//             it("should return the expected result when using /", function () {
//                 evaluate = compile("4 / 2");
//                 expect(evaluate()).to.equal(2);
//             });

//             it("should return the expected result when using %", function () {
//                 evaluate = compile("3 % 2");
//                 expect(evaluate()).to.equal(1);
//             });

//             it("should return the expected result when using &&", function () {
//                 evaluate = compile("true && true");
//                 expect(evaluate()).to.equal(true);
//                 evaluate = compile("true && false");
//                 expect(evaluate()).to.equal(false);
//                 evaluate = compile("false && false");
//                 expect(evaluate()).to.equal(false);
//             });

//             it("should return the expected result when using ||", function () {
//                 evaluate = compile("true || true");
//                 expect(evaluate()).to.equal(true);
//                 evaluate = compile("true || false");
//                 expect(evaluate()).to.equal(true);
//                 evaluate = compile("false || false");
//                 expect(evaluate()).to.equal(false);
//             });

//             it("should return the expected result when using !", function () {
//                 evaluate = compile("!true");
//                 expect(evaluate()).to.equal(false);
//                 evaluate = compile("!false");
//                 expect(evaluate()).to.equal(true);
//             });

//             /* Ooops, angular doesn't support ++. Maybe someday?
//             it("should return the expected result when using ++", function () {
//                 scope.value = 2;
//                 evaluate = compile("value++");
//                 expect(evaluate()).to.equal(3);
//                 expect(scope.value).to.equal(3);
//             });*/

//             /* Ooops, angular doesn't support --. Maybe someday?
//             it("should return the expected result when using --", function () {
//                 scope.value = 2;
//                 evaluate = compile("value--");
//                 expect(evaluate()).to.equal(1);
//                 expect(scope.value).to.equal(1);
//             });*/

//             it("should return the expected result when using ?", function () {
//                 evaluate = compile("true? 'it works' : false");
//                 expect(evaluate()).to.equal("it works");
//                 evaluate = compile("false? false : 'it works'");
//                 expect(evaluate()).to.equal("it works");
//             });

//         });

//         describe("using complex expressions", function () {

//             beforeEach(function () {
                scope.ships = [
                    { pirate: function (str) { return str; } },
                    { pirate: function (str) { return str; } }
                ];
                scope.index = 0;
                scope.pi = "pi";
                scope.Jenny = "Jenny";
            // });

//             it("should still be parseable and executable", function () {
                evaluate = compile("ships[index][pi + 'rate'](Jenny)");
//                 expect(evaluate(scope)).to.equal("Jenny");
//             });

//         });

//         describe("when evaluating syntactical errors", function () {

//             it("should give a readable error message", function () {
//                 expect(function () {
//                     compile("'unterminated string");
//                 }).to.throw("Lexer Error: Unterminated quote at columns 0-20 ['unterminated string] in expression ['unterminated string].");
//             });

//             it("should give a readable error message", function () {
//                 expect(function () {
//                     compile("3 = 4");
//                 }).to.throw("[$parse:lval] Trying to assign a value to a non l-value\nhttp://errors.angularjs.org/\"NG_VERSION_FULL\"/$parse/lval");
//             });

//         });

//         describe("when using filters", function () {

//             it("should apply the given filter", function () {
                expressions.filters.currency = function (input, currency, digits) {
                    input = input.toFixed(digits);

                    if (currency === "EUR") {
                        return input + "€";
                    }
                    return input + "$";
                };

                evaluate = compile("1.2345 | currency:selectedCurrency:2");
                evaluate({
                    selectedCurrency: "EUR"
                })
                // expect(evaluate({
                //     selectedCurrency: "EUR"
                // })).to.equal("1.23€");
//             });

//         });

//         describe("when evaluating the same expression multiple times", function () {
    compile("a")
//             it("should cache the generated function", function () {
//                 expect(compile("a")).to.equal(compile("a"));
//             });

//         });

//         describe("for assigning values", function () {

//             beforeEach(function () {
//                 scope = {};
//             });

//             it("should expose an 'assign'-function", function () {
//                 var fn = compile("a");

//                 expect(fn.assign).to.be.a("function");
//                 fn.assign(scope, 123);
//                 expect(scope.a).to.equal(123);
//             });

//             describe("the 'assign'-function", function () {

//                 it("should work for expressions ending with brackets", function () {
//                     var fn = compile("a.b['c']");

//                     fn.assign(scope, 123);
//                     expect(scope.a.b.c).to.equal(123);
//                 });

//                 it("should work for expressions with brackets in the middle", function () {
//                     var fn = compile("a[\"b\"].c");

//                     fn.assign(scope, 123);
//                     expect(scope.a.b.c).to.equal(123);
//                 });

//                 it("should work for expressions with brackets in the middle", function () {
//                     var fn = compile("a[\"b\"].c");

//                     fn.assign(scope, 123);
//                     expect(scope.a.b.c).to.equal(123);
//                 });

//                 it("should return the result of the assignment", function () {
//                     var fn = compile("a[\"b\"].c");

//                     expect(fn.assign(scope, 123)).to.equal(123);
//                 });

//             });

//         });

//         describe(".cache", function () {

//             it("should be an object by default", function () {
//                 expect(compile.cache).to.be.an("object");
//             });

//             it("should cache the generated function by the expression", function () {
//                 var fn = compile("a");

//                 expect(compile.cache.a).to.equal(fn);
//             });

//             describe("when setting it to false", function () {

//                 it("should disable the cache", function () {
//                     compile.cache = false;
//                     expect(compile("a")).to.not.equal(compile("a"));
//                     compile.cache = {};
//                 });

//             });

//         });

//     });

//     describe(".filters", function () {

//         it("should be an object", function () {
//             expect(expressions.filters).to.be.an("object");
//         });

//     });

// });
