﻿/**
 * 1.0.0 test file.
 * @author: 橘子<daxingplay@gmail.com>
 * @time: 13-3-13 10:46
 * @description:
 */

var ModuleCompiler = require('../index'),
    should = require('should'),
    path = require('path'),
    fs = require('fs'),
    iconv = require('iconv-lite'),
    utils = require('../lib/utils'),
    srcPath = path.resolve(__dirname, './src'),
    distPath = path.resolve(__dirname, './dist');

function removeDistDir(){
    if(fs.existsSync(distPath)){
        utils.rmdirsSync(distPath);
    }
}

before(function(){
    removeDistDir();
});

after(function(){
    removeDistDir();
});

afterEach(function(){
    ModuleCompiler.clean();
});

describe('When clean', function(){
    it('should get an empty options', function(){
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
        config.should.have.property('packages').with.lengthOf(0);
        config.should.have.property('exclude').with.lengthOf(0);
        config.should.have.property('charset', '');
        config.should.have.property('silent', false);
    });
});

describe('When config', function(){

    var config;

    before(function(){
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
    });

    it('should have 3 packages since the last package path cannot be found.', function(){
        config.should.have.property('packages').with.lengthOf(3);
    });
    it('should have exclude, silent and charset', function(){
        config.should.have.property('exclude').with.lengthOf(1);
        config.should.have.property('ignoreFiles').with.lengthOf(1);
        config.should.have.property('silent', true);
        config.should.have.property('charset', 'utf-8');
    });
});

describe('When build with only one package', function(){

    var result;

    var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
        outputFile = path.resolve(distPath, 'package1/one-package-simple.js');

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have file generated.', function(){
        var exists = false;
        if(fs.existsSync(outputFile)){
            exists = true;
        }
        exists.should.equal(true);
    });

    it('should build succesfull without any errors.', function(){
        result.should.have.property('success', true);
    });

    it('should contain a file list.', function(){
        result.should.have.property('files').with.lengthOf('1');
    });

    it('should have proper main module.', function(){
        var file = result.files[0];
        file.name.should.equal('package1/one-package-simple');
        file.should.have.property('requires').with.lengthOf('1');
    });

    it('should have some modules in combo file', function(){
        var submods = result.files[0].dependencies;
        submods.length.should.equal(1);
        submods[0].requires.length.should.equal(1);
        submods[0].name.should.equal('package1/mods/mod1');
        submods[0].dependencies[0].name.should.equal('package1/mods/mod2');
    });

});

describe('When build with a list of files', function(){

    var result;

    var inputFiles = [
            path.resolve(srcPath, 'package1/one-package-simple.js'),
            path.resolve(srcPath, 'package1/charset-gbk.js')
        ],
        outputFiles = [
            path.resolve(distPath, 'package1/one-package-simple.js'),
            path.resolve(distPath, 'package1/charset-gbk.js')
        ];

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have file generated.', function(){
        result.should.have.property('success', true);
        result.should.have.property('files').with.lengthOf('2');
    });

});

describe('When build with module name', function(){

    var result;

    var inputFile = 'package1/one-package-simple.js',
        outputFile = path.resolve(distPath, 'package1/one-package-simple.js');

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have file generated.', function(){
        result.should.have.property('success', true);
        result.should.have.property('files').with.lengthOf('1');
    });

});

describe('When build with two package', function(){

    var result;

    var inputFile = path.resolve(srcPath, 'package1/two-package-simple.js'),
        outputFile = path.resolve(distPath, 'package1/two-package-simple.js');

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have file generated.', function(){
        var exists = false;
        if(fs.existsSync(outputFile)){
            exists = true;
        }
        exists.should.equal(true);
        result.should.have.property('success', true);
        result.should.have.property('files').with.lengthOf('1');
    });

    it('should have proper main module.', function(){
        var file = result.files[0];
        file.name.should.equal('package1/two-package-simple');
    });

    it('should have some modules in combo file', function(){
        var file = result.files[0];
        file.should.have.property('requires').with.lengthOf('2');
        file.should.have.property('dependencies').with.lengthOf('2');
        file.dependencies[0].name.should.equal('package1/mods/mod1');
        file.dependencies[1].name.should.equal('package2/mods/mod1');
    });

});

describe('When build with kissy', function(){

    var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-kissy.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-kissy.js');

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have file generated.', function(){
        var exists = false;
        if(fs.existsSync(outputFile)){
            exists = true;
        }
        exists.should.equal(true);
        result.should.have.property('success', true);
        result.should.have.property('files').with.lengthOf('1');
    });

    it('should have proper main module.', function(){
        var file = result.files[0];
        file.should.have.property('name', 'package1/build-with-kissy');
        file.should.have.property('requires').with.lengthOf('3');
        file.should.have.property('dependencies').with.lengthOf('3');
        file.modules.should.have.property('package1/build-with-kissy');
    });

    it('should not have package prefix in kissy modules.', function(){
        var submods = result.files[0].modules;
        submods.should.have.property('dom');
        submods.should.have.property('event');
        submods['dom'].pkg.should.equal('kissy');
        submods['event'].pkg.should.equal('kissy');
    });

});


//describe('When exclude', function(){
//
//    var result;
//
//    var inputFile = path.resolve(srcPath, 'package1/two-package-simple.js'),
//        outputFile = path.resolve(distPath, 'package1/two-package-with-exclude.js');
//
//    before(function(){
//        ModuleCompiler.config({
//            packages: [{
//                name: 'package1',
//                path: srcPath,
//                charset: 'gbk'
//            }, {
//                name: 'package2',
//                path: srcPath,
//                charset: 'utf-8'
//            }],
//            exclude: ['mod2'],
//            silent: true,
//            charset: 'gbk'
//        });
//        result = ModuleCompiler.build(inputFile, outputFile);
//    });
//
//    after(function(){
//        ModuleCompiler.clean();
//    });
//
//    it('should have file generated.', function(){
//        var exists = false;
//        if(fs.existsSync(outputFile)){
//            exists = true;
//        }
//        exists.should.equal(true);
//        result.should.have.property('success', true);
//        result.should.have.property('files').with.lengthOf('1');
//    });
//
//    it('should have proper main module.', function(){
//        var file = result.files[0];
//        file.name.should.equal('package1/two-package-simple');
//        file.should.have.property('submods').with.lengthOf('4');
//        file.should.have.property('combined').with.lengthOf('3');
//    });
//
//    it('should have some excluded modules in submods', function(){
//        var submods = result.files[0].submods;
//        submods[0].name.should.equal('package1/mods/mod1');
//        submods[0].status.should.equal('ok');
//        submods[1].name.should.equal('package1/mods/mod2');
//        submods[1].status.should.equal('excluded');
//        submods[2].name.should.equal('package2/mods/mod1');
//        submods[2].status.should.equal('ok');
//        submods[3].name.should.equal('package2/mods/mod2');
//        submods[3].status.should.equal('excluded');
//    });
//
//});

describe('When specify a charset in config', function(){

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

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should be gbk in result1', function(){
        var match = testCharset(outputFile1, 'gbk');
        match.length.should.equal(2);
    });

    it('should be gbk in result2', function(){
        var match = testCharset(outputFile2, 'gbk');
        match.length.should.equal(2);
    });

    it('should be utf-8 in result3', function(){
        var match = testCharset(outputFile3, 'utf-8');
        match.length.should.equal(2);
    });

});

describe('When two modules depend on each other', function(){
    var result;

    var inputFile = path.resolve(srcPath, 'package1/circular-requires.js'),
        outputFile = path.resolve(distPath, 'package1/circular-requires.js');

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have 4 modules', function(){
        var submods = result.files[0].modules;
        submods.should.have.property('package1/mods/mod3');
        submods.should.have.property('package1/mods/mod4');
        submods.should.have.property('package1/mods/mod5');
        submods.should.have.property('package1/circular-requires');
    });

    it('should have 4 combined modules', function(){
        var combined = result.files[0].combined;
        combined.length.should.equal(4);
    });
});

describe('When build and combo, ', function(){

    var result;

    var inputFile = path.resolve(srcPath, 'package1/build-with-kissy.js'),
        outputFile = path.resolve(distPath, 'package1/build-with-kissy.js'),
        depFile = path.resolve(distPath, 'package1/dep.js');

    before(function(){
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
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have dep file called dep.js', function(){
        var isExists = fs.existsSync(depFile);
        isExists.should.equal(true);
    });

    it('should have proper config.', function(){
        var depContent = iconv.decode(fs.readFileSync(depFile), 'gbk');
        depContent.should.equal("KISSY.config('modules', {\n 'package1/build-with-kissy': { requires: ['dom', 'event']} \n});");
    });

});

describe('When only combo without build, ', function(){

    var result;

    var inputFile = path.resolve(srcPath, 'package1/one-package-simple.js'),
        depFile = path.resolve(distPath, 'package1/one-package-simple-dep.js');

    before(function(){
        ModuleCompiler.config({
            packages: [{
                name: 'package1',
                path: srcPath,
                charset: 'gbk'
            }],
            silent: true,
            charset: 'gbk'
        });
        result = ModuleCompiler.combo(inputFile, depFile, 'gbk');
    });

    after(function(){
        ModuleCompiler.clean();
    });

    it('should have dep', function(){
        var isExists = fs.existsSync(depFile);
        isExists.should.be.true;
    });

});

//describe('When build a directory and have ignore config', function(){
//    var result;
//
//    var inputDir = path.resolve(srcPath, 'package1/'),
//        outputDir = path.resolve(distPath, 'package1-dir/');
//
//    before(function(){
//        ModuleCompiler.config({
//            packages: [{
//                name: 'package1',
//                path: srcPath,
//                charset: 'gbk'
//            }],
//            silent: true,
//            ignoreFiles: '.js',
//            charset: 'gbk'
//        });
//        result = ModuleCompiler.build(inputDir, outputDir);
//    });
//
//    after(function(){
//        ModuleCompiler.clean();
//    });
//
//    it('should have no files', function(){
//        result.files.length.should.equal(0);
//    });
//});

//describe('When build using module name', function(){
//    var result;
//
//    var outputFile = path.resolve(distPath, 'package1/one-package-simple.js');
//
//    before(function(){
//        ModuleCompiler.config({
//            packages: [{
//                name: 'package1',
//                path: srcPath,
//                charset: 'gbk'
//            }],
//            silent: true,
//            charset: 'gbk'
//        });
//        result = ModuleCompiler.build('package1/one-package-simple.js', outputFile);
//    });
//
//    after(function(){
//        ModuleCompiler.clean();
//    });
//
//    it('should have file generated.', function(){
//        var exists = false;
//        if(fs.existsSync(outputFile)){
//            exists = true;
//        }
//        exists.should.equal(true);
//    });
//
//    it('should build succesfull without any errors.', function(){
//        result.should.have.property('success', true);
//    });
//
//    it('should contain a file list.', function(){
//        result.should.have.property('files').with.lengthOf('1');
//    });
//
//    it('should have proper main module.', function(){
//        var file = result.files[0];
//        file.name.should.equal('package1/one-package-simple');
//        file.should.have.property('submods').with.lengthOf('2');
//    });
//
//    it('should have some modules in combo file', function(){
//        var submods = result.files[0].submods;
//        submods[0].name.should.equal('package1/mods/mod1');
//        submods[0].status.should.equal('ok');
//        submods[1].name.should.equal('package1/mods/mod2');
//        submods[1].status.should.equal('ok');
//    });
//});