/**
 * mod3
 * @author: ��Ӣ��daxingplay��<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add(function (S) {
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