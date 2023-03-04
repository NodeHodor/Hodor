/*
combined files : 

menu/control
menu

*/
/**
 * control
 * @author: 紫英（daxingplay�?<ziying.wzc@taobao.com>
 * @date: 4/14/14
 * @requires: kissy 1.4+
 */
KISSY.add('menu/control',function (S, require, exports, module) {
    'use strict';

    var logger = S.getLogger('control');

    module.exports = {};
});
/**
 * menu
 * @author: 紫英（daxingplay�?<ziying.wzc@taobao.com>
 * @date: 4/14/14
 * @requires: kissy 1.4+
 */
KISSY.add('menu',['menu/control'], function (S, require, exports, module) {
    'use strict';

    var logger = S.getLogger('menu');

    var control = require('menu/control');

    module.exports = {
        init: function(){}
    };
});
