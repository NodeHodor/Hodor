/*
combined files : 

package1/mods/mod6
package1/mods/BOM
package1/mods/mod7
package1/build-with-bom-file

*/
/**
 * mod6
 * 测试一下这种奇葩写法
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-6-8
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod6', function (S) {
        var D = S.DOM,
            E = S.Event,
            LOG_PRE = '[mod6] ';

        return {
            init: function () {

            }
        }
    }

);
/**
 * @fileoverview
 * @author 张挺 <zhangting@taobao.com>
 *
 */
KISSY.add('gallery/auth/1.4/lib/utils', function (S, DOM, undefined) {
    var Utils = {
        toJSON:function (cfg) {
            cfg = cfg.replace(/'/g, '"');
            try {
                eval("cfg=" + cfg);
            } catch (e) {
                S.log('data-valid json is invalid');
            }
            return cfg;
        },
        guid:function () {
            return 'AUTH_' + S.guid();
        },
        getEvent: function(els){
            var event = 'blur',
                type = DOM.attr(els, 'type');
            switch (type) {
                case "select-multiple":
                case "radio":
                case "checkbox":
                    event='click';
                    break;
                default:
                    event = 'blur';
            }
            return event;
        },
        getValue:function(els) {
            var val = [],
                type = DOM.attr(els, 'type');
            switch (type) {
                case "select-multiple":
                    S.each(els.options, function(el) {
                        if (el.selected)val.push(el.value);
                    });
                    break;
                case "radio":
                case "checkbox":
                    S.each(els, function(el) {
                        if (el.checked)val.push(el.value);
                    });
                    break;
                default:
                    val = DOM.val(els);
            }
            return val;
        }
    };

    return Utils;
},{
    requires:[
        'dom'
    ]
});
/**
 * mod7
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-7-11
 * @requires: kissy 1.2+
 */
KISSY.add('package1/mods/mod7',function (S, D, E) {
    var LOG_PRE = '[mod7] ';

    return {
        init: function () {
            S.log('这个文件是UTF-8编码');
        }
    }
}, {
    requires: [
        'dom',
        'event'
    ]
});
/**
 * build with BOM file
 * @author: daxingplay<daxingplay@gmail.com>
 * @time: 13-7-11 17:08
 * @description:
 */
KISSY.add('package1/build-with-bom-file',function (S) {

    return {
        init:function () {
            S.log('mod BOM file will have BOM header.');
        }
    }
}, {
    requires: [
        './mods/mod6',
        './mods/BOM',
        './mods/mod7'
    ]
});
