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

var kmc = require('kmc'),
    fs = require('fs'),
    path = require('path'),
    utils = require('kmc').utils,
    srcPath = path.resolve(__dirname, '../test/src/'),
    distPath = path.resolve(__dirname, './dist');

    try{
        kmc.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            modules: {
                'package1/mods/mod2': {
                    alias: 'package1/mods/mod3'
                }
            },
            silent: true,
            charset: 'gbk'
        });
        result = kmc.analyze(path.resolve(srcPath, 'package1/alias.js'));
        console.log(result);
        
    } catch(e){}

var ModuleCompiler = require('kmc'),
    // should = require('should'),
    path = require('path'),
    fs = require('fs'),
    iconv = require('iconv-lite'),
    utils = require('kmc').utils,
    srcPath = path.resolve(__dirname, './src'),
    distPath = path.resolve(__dirname, './dist');




// utils.rmdirsSync("./tmp1")
// utils.mkdirs("./tmp1");

ModuleCompiler.config({
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }],
    exclude: ['dom','base','event','anim'],
    charset: 'gbk',
    silent: true
});
ModuleCompiler.clean();
var config = ModuleCompiler.config();

var param = {
    packages: [{
        name: 'package1',
        path: srcPath,
        charset: 'gbk'
    }, {
        name: 'package2',
        path: srcPath,
        charset: 'utf-8'
    }, {
        name: 'kissy',
        path: srcPath,
        charset: 'utf-8'
    }, {
        name: 'not-found',
        path: '/home/xxx/lost-found',
        charset: 'gbk'
    }],
    exclude: ['mod2'],
    ignoreFiles: ['.*combo.js'],
    silent: true,
    charset: 'utf-8'
};
config = ModuleCompiler.config(param);


var result;

var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
    outputFile = path.resolve(distPath, 'package1/one-package-simple.js');

// before(function(){
    ModuleCompiler.config({
        packages: [{
            name: 'package1',
            path: srcPath,
            charset: 'gbk'
        }],
        silent: true,
        charset: 'gbk'
    });
    result = ModuleCompiler.build(inputFile, outputFile);
// });
ModuleCompiler.clean();

var result;

    var inputFiles = [
            path.resolve(srcPath, 'package1/one-package-simple.js'),
            path.resolve(srcPath, 'package1/charset-gbk.js')
        ],
        outputFiles = [
            path.resolve(distPath, 'package1/one-package-simple.js'),
            path.resolve(distPath, 'package1/charset-gbk.js')
        ];


        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFiles, outputFiles);
        ModuleCompiler.clean();

        var result;

        var inputFile = 'package1/one-package-simple.js',
            outputFile = path.resolve(distPath, 'package1/one-package-simple.js');
            ModuleCompiler.config({
                packages: [{
                    name: 'package1',
                    path: srcPath,
                    charset: 'gbk'
                }],
                silent: true,
                charset: 'gbk'
            });
            result = ModuleCompiler.build(inputFile, outputFile);
   
            ModuleCompiler.clean();

            var result;

    var inputFile = path.resolve(srcPath, 'package1/two-package-simple.js'),
        outputFile = path.resolve(distPath, 'package1/two-package-simple.js');
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }, {
                name: 'package2',
                path: srcPath,
                charset: 'utf-8'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-kissy.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-kissy.js');
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }, {
                name: 'kissy',
                path: srcPath,
                charset: 'utf-8'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();


        var inputFile = path.resolve(srcPath, 'package1/pkgNameWithSlash.js'),
        outputFile = path.resolve(distPath, 'package1/pkgNameWithSlash.js');
        ModuleCompiler.config({
            packages: [{
                name: 'src/package1',
                path: path.resolve(srcPath, '../'),
                charset: 'gbk',
                ignorePackageNameInUri: false
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        var inputFile = path.resolve(srcPath, 'package1/pkgNameWithSlash.js'),
        outputFile = path.resolve(distPath, 'package1/pkgNameWithSlash.js');
        ModuleCompiler.config({
            packages: [{
                name: 'test/abc',
                path: path.resolve(srcPath, './package1'),
                charset: 'gbk',
                ignorePackageNameInUri: true
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
    

        var ModuleCompiler = require('kmc'),
        // should = require('should'),
        path = require('path'),
        fs = require('fs'),
        os = require('os'),
        iconv = require('iconv-lite'),
        // utils = require('../lib/utils'),
        srcPath = path.resolve(__dirname, './src'),
        distPath = path.resolve(__dirname, './dist'),
        expected = path.resolve(__dirname, './dest');

        function removeDistDir(){
            if(fs.existsSync(distPath)){
                utils.rmdirsSync(distPath);
            }
        }

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            exclude: ['dom','base','event','anim'],
            charset: 'gbk',
            silent: true
        });
        ModuleCompiler.clean();
        var config = ModuleCompiler.config();
        var config;
        var param = {
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }, {
                name: 'package2',
                path: srcPath,
                charset: 'utf-8'
            }, {
                name: 'kissy',
                path: srcPath,
                charset: 'utf-8'
            }, {
                name: 'not-found',
                path: '/home/xxx/lost-found',
                charset: 'gbk'
            }],
            exclude: ['mod2'],
            ignoreFiles: ['.*combo.js'],
            silent: true,
            charset: 'utf-8'
        };
        config = ModuleCompiler.config(param);
        var result;

        var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
            outputFile = path.resolve(distPath, 'package1/one-package-simple.js');
    
            ModuleCompiler.config({
                packages: [{
                    name: 'package1',
                    path: srcPath,
                    charset: 'gbk'
                }],
                silent: true,
                charset: 'gbk'
            });
            result = ModuleCompiler.build(inputFile, outputFile);
            
            
            var inputFiles = [
                path.resolve(srcPath, 'package1/one-package-simple.js'),
                path.resolve(srcPath, 'package1/charset-gbk.js')
            ],
            outputFiles = [
                path.resolve(distPath, 'package1/one-package-simple.js'),
                path.resolve(distPath, 'package1/charset-gbk.js')
            ];
            ModuleCompiler.config({
                packages: [{
                    name: 'package1',
                    path: srcPath,
                    charset: 'gbk'
                }],
                silent: true,
                charset: 'gbk'
            });
            result = ModuleCompiler.build(inputFiles, outputFiles);
    
            var result;

    var inputFile = 'package1/one-package-simple.js',
        outputFile = path.resolve(distPath, 'package1/one-package-simple.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        var result;

        var inputFile = path.resolve(srcPath, 'package1/two-package-simple.js'),
            outputFile = path.resolve(distPath, 'package1/two-package-simple.js');
    
            ModuleCompiler.config({
                packages: [{
                    name: 'package1',
                    path: srcPath,
                    charset: 'gbk'
                }, {
                    name: 'package2',
                    path: srcPath,
                    charset: 'utf-8'
                }],
                silent: true,
                charset: 'gbk'
            });
            result = ModuleCompiler.build(inputFile, outputFile);
        
            var result;

    var inputFile = path.resolve(srcPath, 'package1/two-package-simple.js'),
        outputFile = path.resolve(distPath, 'package1/two-package-simple.js');
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }, {
                name: 'package2',
                path: srcPath,
                charset: 'utf-8'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
    
        var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-kissy.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-kissy.js');
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }, {
                name: 'kissy',
                path: srcPath,
                charset: 'utf-8'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();
        
        var result;

        var inputFile = path.resolve(srcPath, 'package1/two-package-simple.js'),
            outputFile = path.resolve(distPath, 'package1/two-package-with-exclude.js');
    
            ModuleCompiler.config({
                packages: [{
                    name: 'package1',
                    path: srcPath,
                    charset: 'gbk'
                }, {
                    name: 'package2',
                    path: srcPath,
                    charset: 'utf-8'
                }],
                exclude: ['mod2'],
                silent: true,
                charset: 'gbk'
            });
            result = ModuleCompiler.build(inputFile, outputFile);
            ModuleCompiler.clean();

            var result1,
        result2,
        result3;

    var inputFile = path.resolve(srcPath, 'package1/charset-gbk.js'),
        outputFile1 = path.resolve(distPath, 'package1/charset-test-gbk-1.js'),
        outputFile2 = path.resolve(distPath, 'package1/charset-test-gbk-2.js'),
        outputFile3 = path.resolve(distPath, 'package1/charset-test-utf8-1.js');

    function testCharset(file, charset){
        var fileContent = fs.readFileSync(file);
        fileContent = iconv.decode(fileContent, charset);
        return fileContent.match(/模块/g);
    }

    ModuleCompiler.config({
        packages: [{
            name: 'package1',
            path: srcPath,
            charset: 'gbk'
        }, {
            name: 'package2',
            path: srcPath,
            charset: 'utf-8'
        }],
        silent: true,
        charset: 'gbk'
    });
    result1 = ModuleCompiler.build(inputFile, outputFile1);
    result2 = ModuleCompiler.build(inputFile, outputFile2, 'gbk');
    result3 = ModuleCompiler.build(inputFile, outputFile3, 'utf-8');
    ModuleCompiler.clean();

    var result;

    var inputFile = path.resolve(srcPath, 'package1/circular-requires.js'),
        outputFile = path.resolve(distPath, 'package1/circular-requires.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-kissy.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-kissy.js'),
        depFile = path.resolve(distPath, 'package1/dep.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile, 'gbk', 'dep.js');
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
        depFile = path.resolve(distPath, 'package1/one-package-simple-dep.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.combo(inputFile, depFile, 'gbk', false);
   
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/map.js'),
        outputFile = path.resolve(distPath, 'package1/map.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            map: [
                ['package1/', 'app/pkg/']
            ],
            silent: true
        });
        result = ModuleCompiler.build(inputFile, outputFile, 'utf-8');
        ModuleCompiler.clean();



        var result;

    var inputFile = path.resolve(srcPath, 'package1/require-dir.js'),
        outputFile = path.resolve(distPath, 'package1/require-dir.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'utf-8'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/require-relative.js'),
        outputFile = path.resolve(distPath, 'package1/require-relative.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'utf-8'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-gallery.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-gallery.js');

    
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'utf-8'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-bom-file.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-bom-file.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'utf-8'
            }],
            silent: true,
            charset: 'utf-8'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
    
        ModuleCompiler.clean();
    

        var result;

    var inputFile = path.resolve(srcPath, 'a/aa.js'),
        outputFile = path.resolve(distPath, 'a/a-build.js');

        ModuleCompiler.config({
            packages: [{
                name: 'page',
                path: srcPath,
                charset: 'utf-8',
                ignorePackageNameInUri: true
            }],
            silent: true,
            charset: 'utf-8'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();
    
        var result;

    var inputFile = path.resolve(srcPath, 'package3/'),
        outputFile = path.resolve(distPath, 'package3/');

        ModuleCompiler.config({
            packages: [{
                name: 'package3',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile, undefined, undefined, true);
    
        ModuleCompiler.clean();
try{
        var result;
    var hasError = false;

    var inputFile = path.resolve(srcPath, 'package1/error.js'),
        outputFile = path.resolve(distPath, 'package1/error.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath
            }],
            silent: true
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();
   
    } catch(err){}

    var result;
    var hasError = false;

    var inputFile = path.resolve(srcPath, 'package1/require-css.js'),
        outputFile = path.resolve(distPath, 'package1/require-css.js');
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath
            }],
            silent: true
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();
    
        var config;
        config = ModuleCompiler.config({
            packages: {
                'package1': {
                    base: srcPath
                }
            },
            silent: true
        }); 
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/alias.js'),
        outputFile = path.resolve(distPath, 'package1/alias.js');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath
            }],
            modules: {
                'package1/mods/mod2': {
                    alias: 'package1/mods/mod3'
                }
            },
            silent: true
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();
    
        var result;

    var inputFile = path.resolve(srcPath, 'package1/fix-module-name.js'),
        depFile = path.resolve(distPath, 'package1/fix-module-name-dep.js'),
        outputDir = path.resolve(distPath, './fix-module-name');

        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true
        });
        result = ModuleCompiler.combo(inputFile, depFile, '', true, true, outputDir);
        ModuleCompiler.clean();
        var result;

        var inputFile = path.resolve(srcPath, 'package1/fix-module-name.js');
    
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true
        });
        result = ModuleCompiler.info(inputFile);
        ModuleCompiler.clean();

        var result;

    var inputFile = path.resolve(srcPath, 'package1/fix-module-name2.js'),
        depFile = path.resolve(distPath, 'package1/fix-module-name2-dep.js'),
        outputDir = path.resolve(distPath, './fix-module-name2');

        ModuleCompiler.config({
            packages: [{
                name: 'pkg1',
                path: path.resolve(srcPath, './package1'),
                ignorePackageNameInUri: true
            }],
            silent: true
        });
        result = ModuleCompiler.combo(inputFile, depFile, '', true, true, outputDir);
    
        ModuleCompiler.clean();
    

        var result;

    var inputFile = path.resolve(srcPath, 'package-with-define/module-with-define.js'),
        depFile = path.resolve(distPath, 'package-with-define/module-with-define-dep.js'),
        outputDir = path.resolve(distPath, './fix-module-name-with-define');

        ModuleCompiler.config({
            packages: [{
                name: 'package-with-define',
                path: srcPath,
                charset: 'utf-8'
            }],
            silent: true
        });
        result = ModuleCompiler.combo(inputFile, depFile, '', true, true, outputDir);
    
        ModuleCompiler.clean();
    

        var result;

    var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
        outputFile = path.resolve(distPath, 'package1/one-package-simple.js'),
        depPath = path.resolve(distPath, 'dep/package1/one-package-simple.js');

        var result;

        var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
            outputFile = path.resolve(distPath, 'package1/one-package-simple.js'),
            depPath = path.resolve(distPath, 'dep/package1/one-package-simple.js');
    
            ModuleCompiler.clean();
            
            var result;

    var inputFile = path.resolve(srcPath, 'package1/in-function-require.js'),
        outputFile = path.resolve(distPath, 'package1/in-function-require.js');

        ModuleCompiler.config({
            packages: {
                package1: {
                    base: srcPath,
                    charset: 'gbk'
                }
            },
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build({
            src: inputFile,
            dest: outputFile
        });
        ModuleCompiler.clean();


        var result;

    var inputFile = path.resolve(srcPath, 'package1/in-function-require2.js'),
        outputFile = path.resolve(distPath, 'package1/in-function-require2.js');

        ModuleCompiler.config({
            packages: {
                package1: {
                    base: srcPath,
                    charset: 'gbk'
                }
            },
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build({
            src: inputFile,
            dest: outputFile
        });
    
        ModuleCompiler.clean();
    
        var result;

    var inputFile = path.resolve(srcPath, 'package1/kissy-extend.js'),
        outputFile = path.resolve(distPath, 'package1/kissy-extend.js');

        ModuleCompiler.config({
            packages: {
                package1: {
                    base: srcPath,
                    charset: 'gbk'
                }
            },
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build({
            src: inputFile,
            dest: outputFile
        });

        ModuleCompiler.clean();
    

        var result;
    var inputFile = path.resolve(srcPath, 'package1/kissy-sub-module.js'),
        outputFile = path.resolve(distPath, 'package1/kissy-sub-module.js');

        ModuleCompiler.config({
            packages: {
                package1: {
                    base: srcPath,
                    charset: 'gbk'
                }
            },
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build({
            src: inputFile,
            dest: outputFile,
            depPath: path.resolve(distPath, 'package1/kissy-sub-module.map.js'),
        });
        ModuleCompiler.clean();
    
        var result;

    var inputFile = path.resolve(srcPath, 'package5/menu.js'),
        outputFile = path.resolve(distPath, 'package5/menu.js');

        ModuleCompiler.config({
            packages: [{
                name: 'menu',
                path: path.resolve(srcPath, './package5/menu'),
                charset: 'gbk',
                ignorePackageNameInUri: true
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.build(inputFile, outputFile);
        ModuleCompiler.clean();
        var result;

        var inputFile = path.resolve(srcPath, 'package1/pkgNameWithSlash.js'),
            outputFile = path.resolve(distPath, 'package1/pkgNameWithSlash.js');
    
            ModuleCompiler.config({
                packages: [{
                    name: 'test/abc',
                    path: path.resolve(srcPath, './package1'),
                    charset: 'gbk',
                    ignorePackageNameInUri: true
                }],
                silent: true,
                charset: 'gbk'
            });
            result = ModuleCompiler.build(inputFile, outputFile);
            ModuleCompiler.clean();
            var result;

            var inputFile = path.resolve(srcPath, 'package1/pkgNameWithSlash.js'),
                outputFile = path.resolve(distPath, 'package1/pkgNameWithSlash.js');
        
                ModuleCompiler.config({
                    packages: [{
                        name: 'src/package1',
                        path: path.resolve(srcPath, '../'),
                        charset: 'gbk',
                        ignorePackageNameInUri: false
                    }],
                    silent: true,
                    charset: 'gbk'
                });
                result = ModuleCompiler.build(inputFile, outputFile);
                ModuleCompiler.clean();
                var result;

                var inputFile = path.resolve(srcPath, 'others/kissy-use.js'),
                    outputFile = path.resolve(distPath, 'others/kissy-use.js');
            
                    ModuleCompiler.config({
                        packages: {
                            pkg1: {
                                base: path.resolve(srcPath, 'package1'),
                                ignorePackageNameInUri: true
                            },
                            pkg2: {
                                base: path.resolve(srcPath, 'package2'),
                                ignorePackageNameInUri: true
                            }
                        },
                        silent: true
                    });
                    result = ModuleCompiler.build(inputFile, outputFile);
                    ModuleCompiler.clean();
   
