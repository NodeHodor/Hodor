/**
 * map
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-4-11
 * @requires: kissy 1.2+
 */
KISSY.add(function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[map] ';

    return {
        init: function () {
            S.log('test map.');
        }
    }
}, {
    requires: [
        'package1/mods/mod1',
        "package1/mods/mod2",
        './mods/mod3'
    ]
});