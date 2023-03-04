/*
combined files : 

package3/mods/mod2
package3/mods/mod1

*/
/**
 * mod2
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-9-22
 * @requires: kissy 1.2+
 */
KISSY.add('package3/mods/mod2',function (S, D, E) {
    var LOG_PRE = '[mod2] ';

    return {
        init: function () {
        }
    }
}, {
    requires: [
        'dom',
        'event'
    ]
});
/**
 * mod1
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-9-22
 * @requires: kissy 1.2+
 */
KISSY.add('package3/mods/mod1',function (S, node) {
    var LOG_PRE = '[mod1] ';

    return {
        init: function () {
        }
    }
}, {
    requires: [
        'node',
        './mod2'
    ]
});
