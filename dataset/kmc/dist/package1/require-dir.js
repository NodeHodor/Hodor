/*
combined files : 

package1/mods/index
package1/require-dir

*/
/**
 * index
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-4-23
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/index',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[index] ';

    return {
        init: function () {
            S.log('./mods/ required.');
        }
    }
});
/**
 * init.js for package 1. This package is utf-8 encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-4-23
 * @requires: kissy 1.2+
 */
KISSY.add('package1/require-dir',function (S) {
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
        './mods/'
    ]
});
