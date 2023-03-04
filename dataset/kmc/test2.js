var kmc = require('kmc');
 
kmc.config({
    // 和KISSY一样，可以配置多个包
    packages: [{
        'name': 'app1',
        'path': 'app1这个包所在目录的绝对路径',
        // 这里是指app1这个包中的文件的编码，同一个包内的编码请保持一致
        'charset': 'gbk'
    }, {
        'name': 'app2',
        'path': 'app2这个包所在目录的绝对路径',
        // 这里是指app2这个包源码的编码
        'charset': 'utf-8'
    }],
    // 可以设置哪些模块不打包进来。注意，这里exclude的是具体的模块名，支持正则
    exclude: ['base', 'event'],
    // 如果是对一个目录下的所有文件进行打包，可以设置哪些文件不打包进来，支持正则。注意和上面的exclude的配置的区别。
    ignoreFiles: ['.combo.js', '-min.js'],
    // 输出的文件名后缀，不带.js，比如打包后你想输出为xxx.combine.js，那么这里就配置为：.combine
    suffix: '',
    // 类似于KISSY的map方法，可以自己定义把模块名中的路径进行替换
    map: [
        // 这样配置的话，那么，如果原先输出的app1的模块名中含有app1/2.0/字样的话，就会被替换成app1/19891014/
        ['app1/2.0/', 'app1/19891014/']
    ],
    // 这里设置的是最后打包出来的文件的编码，默认UTF-8，这里的设置相当于是全局设置，下面build中的设置是针对单一打包实例的
    charset: 'gbk'
});
 
/**
 * 打包一个文件/目录
 * @param src {String} 源文件/目录的绝对路径.
 * @param dest {String} 打包出来的文件/目录的路径.
 * @param outputCharset {String} 输出编码，这里的设置会覆盖config.charset中的设置，默认UTF-8
 * @return {Object} 打包出来的文件信息
 */
kmc.build({
    src: 'xxx.js',
    dest: 'xxx.combine.js',
    outputCharset: 'gbk'
});

var kmc = require('kmc'),
    fs = require('fs'),
    path = require('path'),
    utils = require('./lib/utils'),
    srcPath = path.resolve(__dirname, './test/src/'),
    distPath = path.resolve(__dirname, './dist');

var result;

// build with only one package.
kmc.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }],
    silent: true,
    charset: 'gbk'
});
// result = kmc.analyze(path.resolve(srcPath, 'package1/build-with-kissy.js'));
// console.log(result);

var file1 = path.resolve(srcPath, 'package1/build-with-kissy.js'),
    file1output = path.resolve(distPath, 'package1/build-with-kissy.js');
kmc.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }],
    silent: true,
    charset: 'gbk'
});
// result = kmc.build(file1, file1output, 'gbk', 'dep.js');
// console.log(result);

kmc.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }]
});

var kmc = require('kmc'),
    fs = require('fs'),
    path = require('path'),
    srcPath = path.resolve(__dirname, './test/src/'),
    distPath = path.resolve(__dirname, './dist'),
    result;

kmc.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'utf-8'
    }]
});

result = kmc.build('package1/build-with-non-standard-modules', distPath);


var path = require('path');
var kmc = require('kmc');

var pkgBase = path.resolve(__dirname, './test/src');

// kmc.config({
//     packages: {
//         package4: {
//             base: pkgBase
//         }
//     }
// });

kmc.build({
    src: path.resolve(pkgBase, './package4/index.js'),
    dest: path.resolve(__dirname, './test/dest/package4/'),
    depPath: path.resolve(__dirname, './test/dest/package4/map.js')
});

kmc.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }],
    silent: true,
    charset: 'gbk'
});
try{
    result = kmc.analyze(path.resolve(srcPath, 'package1/build-with-kissy.js'));
}catch(e){

}

var file1 = path.resolve(srcPath, 'package1/build-with-kissy.js'),
    file1output = path.resolve(distPath, 'package1/build-with-kissy.js');
kmc.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }],
    silent: true,
    charset: 'gbk'
});
result = kmc.build(file1, file1output, 'gbk', 'dep.js');
console.log(result);