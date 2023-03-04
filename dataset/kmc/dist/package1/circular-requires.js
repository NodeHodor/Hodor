/*
combined files : 

package1/mods/mod4
package1/mods/mod3
package1/mods/mod5
package1/circular-requires

*/
/**
 * mod4
 * @author: ×ÏÓ¢£¨daxingplay£©<daxingplay@gmail.com>
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
 * @author: ×ÏÓ¢£¨daxingplay£©<daxingplay@gmail.com>
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
 * mod5
 * @author: ×ÏÓ¢£¨daxingplay£©<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod5',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod5] ';

    return {
        init:function () {
            S.log(LOG_PRE + 'this depends on main init file? how disgusting.');
        }
    }
}, {
    requires: [
        '../circular-requires'
    ]
});
/**
 * circular-requires
 * @author: ×ÏÓ¢£¨daxingplay£©<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('package1/circular-requires',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[circular-requires] ';

    return {
        init:function () {
            S.log('depends on mod3.');
        }
    }
}, {
    requires: [
        './mods/mod3',
        './mods/mod4',
        './mods/mod5'
    ]
});
