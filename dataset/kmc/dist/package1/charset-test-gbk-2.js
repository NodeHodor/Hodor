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
            S.log('���ģ���Դ����UTF-8��Ŷ');
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
            S.log('���ģ���Դ����GBK��Ŷ');
        }
    }
}, {
    requires: [
        'package2/charset-utf8'
    ]
});
