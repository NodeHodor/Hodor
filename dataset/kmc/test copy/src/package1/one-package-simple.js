/**
 * init.js for package 1. This package is gbk encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add(function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[init.js] ';

    return {
        init:function () {
            S.log('���ļ�ΪGBK����');
        }
    }
}, {
    requires: [
        './mods/mod1'
    ]
});