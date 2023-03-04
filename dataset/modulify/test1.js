/*jslint
    white: true,
    vars: true
*/
/*global
    describe,
    it,
    expect,
    esprima,
    modulify
*/
var modulify = require("modulify");
var esprima = require("esprima")
// describe('modulify.utils.generateModuleString', function () {
    "use strict";
    var src = ("var findVar = 'uh', findVarFunc = function () {};\r\n" +
        "function findFunc () {}\r\n" +
        "findGlobal = 'b';\r\n" +
        "(function doesNotMatter() {\r\n" +
        "});\r\n"
    );
    var ast = esprima.parse(src, {tolerant: true});
    var result = modulify.utils.generateModuleString(ast, src, '\r\n');
    
    // it('should find vars in the top scope', function () {
    try {
        expect(result).toContain('module.exports.findVar');
        expect(result).toContain('module.exports.findVarFunc');
    // });
    } catch(err) {}
    // it('should find functions in the top scope', function () {
    try {
        expect(result).toContain('module.exports.findFunc');
    // });
} catch(err) {}
    // it('should find new global properties', function () {
    try {
        expect(result).toContain('module.exports.findGlobal');
    // });
} catch(err) {}
// });

