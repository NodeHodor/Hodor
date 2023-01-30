var kmc = require('kmc');
 
// 这里和KISSY.config一样，先配置包
kmc.config({
    packages: [{
        'name': 'sh',
        'path': '这里建议写绝对路径，即sh这个包所在的目录',
        'charset': 'gbk'
    }]
});
 
// 将xxx.js打包为xxx.combine.js，输出编码为GBK
kmc.build('xxx.js', 'xxx.combine.js', 'gbk');
 
// 用node执行你这个打包脚本就ok啦～
