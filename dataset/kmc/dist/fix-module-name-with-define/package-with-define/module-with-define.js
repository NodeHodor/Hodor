/**
 * Created by lizn on 14/11/10.
 */
define('package-with-define/module-with-define',['./mods/a'], function (require, exports, module) {
    var a = require('./mods/a');

    module.exports = {
        hello: 'world',
        a: a
    };
});