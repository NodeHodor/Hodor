/**
 * mod7
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-7-11
 * @requires: kissy 1.2+
 */
KISSY.add(function (S, D, E) {
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