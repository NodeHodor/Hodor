/*
combined files : 

package1/mods/mod2
package1/mods/mod1
package1/kissy-sub-module

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
 * xtemplate
 * @author: 橘子（daxingplay�?<daxingplay@gmail.com>
 * @date: 2/20/14
 * @requires: kissy 1.4+
 */
KISSY.add('package1/kissy-sub-module',['./mods/mod1.css', 'event', './mods/mod1', 'xtemplate/runtime', 'dom'], function(S,require){
    require('./mods/mod1.css');
    var Event = require('event');
    var adder = require('./mods/mod1');
    var XTemplate = require('xtemplate/runtime');
    var Dom = require('dom');
    return {
        init:function(a,b,el,btn){
            S.log('hehe');
        }
    };
});
