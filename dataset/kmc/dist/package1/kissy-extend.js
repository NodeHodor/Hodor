/*
combined files : 

package1/mods/mod2
package1/mods/mod1
package1/kissy-extend

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
            S.log('Mod2Ҳ��GBK����');
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
            S.log('Mod1Ҳ��GBK���롣');
        }
    }
}, {
    requires: [
        './mod2'
    ]
});
/**
 * kissy-extend
 * @author: 紫英（daxingplay�?<daxingplay@gmail.com>
 * @date: 1/13/14
 * @requires: kissy 1.2+
 */
KISSY.add('package1/kissy-extend',function (S, Node) {
    var $ = Node.all;
    var LOG_PRE = '[kissy-extend] ';

    return {
        init: function () {
        }
    }
}, {
    requires: [
        'node',
        './mods/mod1'
    ],
    cssRequires: [
        './mods/mod1.css'
    ]
});
