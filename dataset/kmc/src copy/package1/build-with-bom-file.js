/**
 * build with BOM file
 * @author: daxingplay<daxingplay@gmail.com>
 * @time: 13-7-11 17:08
 * @description:
 */
KISSY.add(function (S) {

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