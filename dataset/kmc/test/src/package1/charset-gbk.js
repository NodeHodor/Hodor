/**
 * charset-gbk
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add(function (S) {
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