
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
    


