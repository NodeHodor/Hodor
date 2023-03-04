/*
combined files : 

package1/mods/mod1
package1/one-package-simple

*/
/**
 * mod1
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod1',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod1] ';

    return {
        init:function () {
            S.log('Mod1也是GBK编码。');
        }
    }
}, {
    requires: [
        './mod2'
    ]
});
/**
 * init.js for package 1. This package is gbk encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add('package1/one-package-simple',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[init.js] ';

    return {
        init:function () {
            S.log('该文件为GBK编码');
        }
    }
}, {
    requires: [
        './mods/mod1'
    ]
});
