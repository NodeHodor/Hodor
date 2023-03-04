/*
combined files : 

package1/mods/mod2
package1/mods/mod1
package1/require-relative

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
            S.log('Mod2也是GBK编码');
        }
    }
});
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
 * init.js for package 1. This package is utf-8 encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-4-23
 * @requires: kissy 1.2+
 */
KISSY.add('package1/require-relative',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[init.js] ';

    return {
        init:function () {
            S.log('璇ユ枃浠朵负UTF-8缂栫爜');
        }
    }
}, {
    requires: [
        './mods/mod1',
        'mods/mod2'
    ]
});
