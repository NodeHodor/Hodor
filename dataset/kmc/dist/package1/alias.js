/*
combined files : 

package1/mods/mod4
package1/mods/mod3
package1/alias

*/
/**
 * mod4
 * @author: ��Ӣ��daxingplay��<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod4',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod4] ';

    return {
        init:function () {
            S.log(LOG_PRE);
        }
    }
}, {
    requires: [
        './mod3'
    ]
});
/**
 * mod3
 * @author: ��Ӣ��daxingplay��<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod3',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod3] ';

    return {
        init:function () {
            S.log(LOG_PRE);
        }
    }
}, {
    requires: [
        './mod4'
    ]
});
/**
 * init.js for package 1. This tests alias configuration.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add('package1/alias',function (S) {
    var LOG_PRE = '[init.js] ';

    return {
        init:function () {
            S.log('Alias test');
        }
    }
}, {
    requires: [
        './mods/mod2'
    ]
});
