/**
 * init.js for package 1. This package is utf-8 encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-4-23
 * @requires: kissy 1.2+
 */
KISSY.add(function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[init.js] ';

    return {
        init:function () {
            S.log('该文件为UTF-8编码');
        }
    }
}, {
    requires: [
        './mods/'
    ]
});