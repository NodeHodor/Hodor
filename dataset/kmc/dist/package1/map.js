/*
combined files : 

app/pkg/mods/mod2
app/pkg/mods/mod1
app/pkg/mods/mod4
app/pkg/mods/mod3
app/pkg/map

*/
/**
 * mod2, gbk encoded.
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add('app/pkg/mods/mod2',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod2] ';

    return {
        init:function () {
            S.log('Mod2也是GBK编码');
        }
    }
});
/**
 * mod1
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12-9-26
 * @requires: kissy 1.2+
 */
KISSY.add('app/pkg/mods/mod1',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod1] ';

    return {
        init:function () {
            S.log('Mod1也是GBK编码。');
        }
    }
}, {
    requires: [
        './mod2'
    ]
});
/**
 * mod4
 * @author: 紫英（daxingplay）<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('app/pkg/mods/mod4',function (S) {
    var D = S.DOM,
        E = S.Event,
        LOG_PRE = '[mod4] ';

    return {
        init:function () {
            S.log(LOG_PRE);
        }
    }
}, {
    requires: [
        './mod3'
    ]
});
/**
 * mod3
 * @author: 紫英（daxingplay）<daxingplay@gmail.com>
 * @date: 12-9-28
 * @requires: kissy 1.2+
 */
KISSY.add('app/pkg/mods/mod3',function (S) {
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
/**
 * map
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 13-4-11
 * @requires: kissy 1.2+
 */
KISSY.add('app/pkg/map',function (S) {
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
        'app/pkg/mods/mod1',
        "app/pkg/mods/mod2",
        './mods/mod3'
    ]
});
