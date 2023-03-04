/*
combined files : 

package1/build-with-gallery

*/
/**
 * build with kissy gallery
 * @author: daxingplay<daxingplay@gmail.com>
 * @time: 13-6-8 09:23
 * @description:
 */
KISSY.add('package1/build-with-gallery',function (S) {

    return {
        init:function () {
            S.log('this file will have kissy gallery modules.');
        }
    }
}, {
    requires: [
        'gallery/calendar/1.1/index'
    ]
});
