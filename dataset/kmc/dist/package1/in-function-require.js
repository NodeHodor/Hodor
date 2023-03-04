/*
combined files : 

package1/mods/mod2
package1/in-function-require

*/
/**
 * mod2, gbk encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod2',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod2] ';

    return {
        init:function () {
            S.log('Mod2Ò²ÊÇGBK±àÂë');
        }
    }
});
/**
 * in-function-require
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12/1/13
 * @requires: kissy 1.2+
 */
KISSY.add('package1/in-function-require',['node', './mods/mod2'], function (S, require) {
    var Node = require('node');
    var Mod1 = require('./mods/mod2');
    var $ = Node.all;
    var LOG_PRE = '[in-function-require] ';

    return {
        init: function () {
            Mod1.init();
        }
    }
});
