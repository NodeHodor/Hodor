/*
combined files : 

package1/in-function-require2

*/
/**
 * in-function-require
 * @author: daxingplay<daxingplay@gmail.com>
 * @date: 12/1/13
 * @requires: kissy 1.2+
 */
KISSY.add('package1/in-function-require2',['node'], function (S, require) {
    var Node = require('node');
    var str = '.test';
    var Mod1 = require('./mods/mod2' + str);
    var $ = Node.all;
    var LOG_PRE = '[in-function-require] ';

    return {
        init: function () {
            Mod1.init();
        }
    }
});
