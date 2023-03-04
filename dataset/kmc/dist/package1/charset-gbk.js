/*
combined files : 

package2/charset-utf8
package1/charset-gbk

*/
/**
 * charset-utf8
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('package2/charset-utf8',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[charset-utf8] ';

    return {
        init:function () {
            S.log('这个模块的源码是UTF-8的哦');
        }
    }
});
/**
 * charset-gbk
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('package1/charset-gbk',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[charset-gbk] ';

    return {
        init:function () {
            S.log('这个模块的源码是GBK的哦');
        }
    }
}, {
    requires: [
        'package2/charset-utf8'
    ]
});
