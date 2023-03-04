/*
combined files : 

package1/mods/mod2
package1/mods/mod1
package1/build-with-kissy

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
 * build-with-kissy
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-27
 * @requires: kissy 1.2+
 */
KISSY.add('package1/build-with-kissy',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[build-with-kissy] ';

    return {
        init:function () {
            S.log('this file will have kissy modules.');
        }
    }
}, {
    requires: [
        'dom',
        'event',
        './mods/mod1'
    ]
});
