/**
 * Module Compiler for KISSY 1.2+
 * @author daxingplay<daxingplay@gmail.com>
 */
var fs = require('fs'),
    path = require('path'),
    fileUtil = require('./fileUtil'),
    iconv = require('iconv-lite'),
    colors = require('colors');

function startWith(str, prefix){
    return str.lastIndexOf(prefix, 0) === 0;
}

function convertCharset(charset){
    charset = charset.toLowerCase();
    if(charset == '' || charset == 'gbk' || charset == 'gb2312'){
        charset = '';
    }
    return charset;
}

function addPkgNameToPath(pkgPath, pkgName){
    if(pkgName){
        var basename = path.basename(pkgPath).replace(/(\\|\/)$/, '');
        if(basename != pkgName){
            pkgPath = path.normalize(path.join(pkgPath, pkgName));
        }
    }
    return pkgPath;
}

function concat(a, origin){
    if(a && origin && typeof origin.length !== 'undefined'){
        if(typeof a === 'string'){
            origin.push(a);
        }else if(a.length){
            origin = origin.concat(a);
        }
    }
    return origin;
}

var ModuleCompiler = {
    _config: {
        exclude: [],
        ignoreFiles: [],
        suffix: '',
        charset: '',
        debug: false,
        combine: false,
        silent: false
    },
    _packages: {},
    _mappedRules: [],
    _moduleCache: {},
    _analyzedFiles: [],
    _combinedModules: [],
    _dependencies: {},
    _clean: function(){
        this._moduleCache = {};
        this._analyzedFiles = [];
        this._combinedModules = [];
        this._dependencies = {};
    },
    _parseConfig: function(cfg){
        var self = this;
        if(cfg.packages){
            for(var i = 0; i < cfg.packages.length; i++){
                var pkg = cfg.packages[i];
                if(typeof pkg.charset === 'undefined'){
                    // if left blank, node will treat it as utf-8
                    pkg.charset = '';
                }
                pkg.path = path.resolve(addPkgNameToPath(pkg.path, pkg.name)) || __dirname;
                pkg.combine = !!pkg.combine;
                if(fs.existsSync(pkg.path)){
                    self._packages[pkg.name] = pkg;
                }
            }
        }
        if(cfg.map){
            for(var i = 0; i < cfg.map.length; i++){
                var curMap = cfg.map[i];
                if(curMap && typeof curMap[0] !== 'undefined' && typeof curMap[1] !== 'undefined'){
                    self._mappedRules.push(curMap);
                }
            }
        }
        if(cfg.suffix){
            self._config.suffix = cfg.suffix;
        }
        self._config.debug = cfg.debug ? true : false;
//        if(cfg.exclude){
//            if(typeof cfg.exclude === 'string'){
//                self._config.exclude.push(cfg.exclude);
//            }else{
//                self._config.exclude = self._config.exclude.concat(cfg.exclude);
//            }
//        }
        self._config.exclude = concat(cfg.exclude, self._config.exclude);
        self._config.ignoreFiles = concat(cfg.ignoreFiles, self._config.ignoreFiles);
        self._config.charset = cfg.charset ? cfg.charset : '';
        self._config.silent = !!cfg.silent;
        return self._config;
    },
    _removeComments: function(str){
        var totallen = str.length,
            token;

        // remove single line comments
        var startIndex = 0;
        var endIndex = 0;
        var comments = [];
        while ((startIndex = str.indexOf("//", startIndex)) >= 0) {
            endIndex = str.indexOf("\n", startIndex + 2);
            if (endIndex < 0) {
                endIndex = totallen;
            }
            token = str.slice(startIndex + 2, endIndex);
            comments.push(token);
            startIndex += 2;
        }
        for (var i=0,max=comments.length; i<max; i = i+1){
            str = str.replace("//" + comments[i] + "\n", "");
        }

        // remove multi line comments.
        startIndex = 0;
        endIndex = 0;
        comments = [];
        while ((startIndex = str.indexOf("/*", startIndex)) >= 0) {
            endIndex = str.indexOf("*/", startIndex + 2);
            if (endIndex < 0) {
                endIndex = totallen;
            }
            token = str.slice(startIndex + 2, endIndex);
            comments.push(token);
            startIndex += 2;
        }
        for (i=0,max=comments.length; i<max; i = i+1){
            str = str.replace("/*" + comments[i] + "*/", "");
        }

        // remove white spaces
        str = str.replace(/\s+/g, " ");

        return str;
    },
    _analyzeRequires: function(filePath){
        var self = this;
        if(self._analyzedFiles.indexOf(filePath) > 0){
            self._config.debug && console.log('file :' + filePath + ' already analyzed.');
        }else if(fs.existsSync(filePath)){
            self._analyzedFiles.push(filePath);

            var fileContent = fs.readFileSync(filePath).toString();
            // remove comments
            fileContent = self._removeComments(fileContent);

            var requires = fileContent.match(/\{[\s\w:'",]*requires['"\s]*:\s*(\[?[^;\}]*\]?)\}\s*\)/g);
            if(requires != null){
                for(var i = 0; i < requires.length; i++){
                    var requiredModules = eval('(' + requires[i]).requires;
                    for(var j = 0; j < requiredModules.length; j++){
                        var requirePath = requiredModules[j],
                            module;

                        if(path.extname(requirePath) == '.css') {
                            continue;
                        }
                        module = self._addModule(requirePath, path.dirname(filePath));
                        if(module !== null && module.path){
//                            self._analyzedFiles.push(module.path);
                            self._analyzeRequires(module.path);
                        }
                    }
                }
            }else{
                self._config.debug && console.log('INFO: module ' + filePath + ' has no depends.');
            }
        }else{
            !self._config.silent && console.log('WARING: file %s not found.', filePath);
        }
    },
    _resolveModuleName: function(modulePath, pkg){
        var relativePkgPath = path.relative(pkg.path, modulePath).replace(/\\/g, '/'),
            moduleName = relativePkgPath.replace(/^\.\//, '');
        if(!startWith(relativePkgPath, pkg.name + '/') && pkg.name !== 'kissy'){
            moduleName = pkg.name + '/' + moduleName;
        }
        return moduleName.replace(/\.js$/i, '');
    },
    _addModule: function(requirePath, curDir){
        var self = this,
            module = {};
        if(requirePath.match(/\.js$/i)){
            if(typeof curDir === 'undefined' || fs.existsSync(requirePath)){
                self._config.debug && console.log('core module ' + requirePath);
                module.path = requirePath;
            }
        }else{
            requirePath += '.js';
        }
        if(requirePath.match(/^\.{1,2}/) && curDir){
            module.path = path.resolve(curDir, requirePath);
        }else{
            if(requirePath.indexOf('/') === 0){
                requirePath = requirePath.substring(1);
            }
        }
        var packageName,
            packagePath = '';
        for(var pkgName in self._packages){
            if(self._packages.hasOwnProperty(pkgName)){
                var pkg = self._packages[pkgName];
                if(startWith(requirePath, pkg.name + '/')){
                    module.path = path.resolve(pkg.path, requirePath.replace(pkg.name + '/', ''));
                    if(fs.existsSync(module.path)){
                        packageName = pkg.name;
                        module.name = requirePath;
                        break;
                    }
                }
                if(module.path){
                    var curRelativePath = path.relative(pkg.path, module.path);
                    if(packagePath == '' || packagePath.length > curRelativePath.length){
                        packagePath = curRelativePath;
                        packageName = pkg.name;
                    }
                }else{
                    var curPath = path.normalize(path.join(pkg.path, requirePath));
                    if(fs.existsSync(curPath)){
                        module.path = curPath;
                        packageName = pkg.name;
                        break;
                    }
                }
            }
        }
        if(module.path){
            module.package = self._packages[packageName];
            module.name = (typeof module.name === 'undefined' ? self._resolveModuleName(module.path, module.package) : module.name).replace(/\.js\s*$/i, '');
            module.name = self._mapModuleName(module.name);
            module.charset = module.package.charset;
            if(module.name){
                if(!self.isExcluded(module.name)){
                    if(fs.existsSync(module.path)){
                        module.status = 'ok';
                    }else{
                        module.status = 'missing';
                    }
                }else{
                    module.status = 'excluded';
                }
            }else{
                module.status = 'error';
            }
            self._moduleCache[module.name] = module;
            self._combinedModules.push(module.name);
//            self._analyzedFiles.push(module.path);
            return module;
        }else{
            self._config.debug && console.log('module %s cannot be found.', requirePath);
        }
        return null;
    },
    _mapModuleName: function(moduleName){
        var self = this;
        if(self._mappedRules.length > 0){
            for(var i = 0; i < self._mappedRules.length; i++){
                var rule = self._mappedRules[i];
                if(moduleName.match(rule[0])){
                    return moduleName.replace(rule[0], rule[1]);
                }
            }
        }
        return moduleName;
    },
    _combo: function(result, outputPath, outputCharset){
        var self = this,
            combinedComment = [
                '/*',
                'combined files : ',
                '',
                result.combined.join('\r\n'),
                '',
                '*/',
                ''
            ].join('\r\n');

        // deal with output charset. if not specified, use charset in config.
        outputCharset = (typeof outputCharset === 'undefined' || outputCharset === null) ? self._config.charset : outputCharset;

        var combineFile = self._config.suffix ? outputPath.replace(/\.js$/i, self._config.suffix + '.js') : outputPath;

        //prepare output dir
        fileUtil.mkdirsSync(path.dirname(combineFile));

        // if exists, unlink first, otherwise, there may be some problems with the file encoding.
        if(fs.existsSync(combineFile)){
            fs.unlinkSync(combineFile);
        }

        var fd = fs.openSync(combineFile, 'w');
//        fs.writeSync(fd, combinedComment, 0, convertCharset(self._config.charset));
        var combinedCommentBuffer = iconv.encode(combinedComment, outputCharset);
        fs.writeSync(fd, combinedCommentBuffer, 0, combinedCommentBuffer.length);
        fs.closeSync(fd);

        fd = fs.openSync(combineFile, 'a');

        for (var moduleName in result._moduleCache) {
            if(result._moduleCache.hasOwnProperty(moduleName)){
                var module = result._moduleCache[moduleName],
                    moduleContent = iconv.decode(fs.readFileSync(module.path), module.charset);

                //add module path
                var start = moduleContent.indexOf('KISSY.add(');
                if(start == -1) {
                    start = moduleContent.indexOf('.add(');
                    if(start != -1) {
                        start = start + 5;
                    }
                } else {
                    start = start + 10;
                }

                var end = moduleContent.indexOf('function', start);

                //find it
                if(start > -1 && end > start) {
                    //KISSY.add(/*xxx*/function(xxx)) or KISSY.add('xxx', function(xxx))
                    //remove user comments but preserve user defined module name.
                    var oldModuleName = moduleContent.substring(start, end),
                        moduleNameRegResult = oldModuleName.match(/^(\s*)\/\*(.*)\*\/(\s*)$/);
                    if(moduleNameRegResult != null){
                        // replace user comments with my module name.
//                        moduleContent = moduleContent.replace(oldModuleName, moduleNameRegResult[1]);
                        moduleContent = moduleContent.replace(oldModuleName, '\'' + module.name + '\', ');
                    }
                } else if(start > -1 && end == start) {
                    //KISSY.add(function(xxx))
                    moduleContent = [moduleContent.slice(0, start), '\'' + module.name + '\',', moduleContent.slice(end)].join('');
                }

                // add a new line after.
                moduleContent += '\r\n';

                var buffer = iconv.encode(moduleContent, outputCharset);
                fs.writeSync(fd, buffer, 0, buffer.length);
            }
        }

        fs.closeSync(fd);

    },
    analyze: function(inputPath){
        var self = this,
            result = null;
        self._analyzeRequires(inputPath);
        var dependencies = [],
            combined = [],
            moduleCache = {};
        for(var moduleName in self._moduleCache){
            var module = self._moduleCache[moduleName];
            dependencies.push(module);
            if(module.status == 'ok'){
                combined.push(module.name);
                moduleCache[module.name] = module;
            }
        }
        var coreModule = self._addModule(inputPath);
        if(coreModule){
            if(combined.indexOf(coreModule.name) > 0){
                // this situation is rare. But we should consider it.
                self._config.debug && console.log('core module already added before. Skip...');
            }else{
                combined.push(coreModule.name);
                moduleCache[coreModule.name] = coreModule;
            }
            result = coreModule;
            result.submods = dependencies;
            result.combined = combined;
            result._moduleCache = moduleCache;
        }
        // clean.
        self._clean();
        return result;
    },
    build: function(inputPath, outputPath, outputCharset){
        var self = this;
//        self._analyzeRequires(inputPath);
//        var coreModule = self._addModule(inputPath);
        var result = self.analyze(inputPath);
//        self._config.charset = coreModule.charset;
        // combo file.
        self._combo(result, outputPath, outputCharset);
        !self._config.silent && console.info('[ok]'.bold.green+' ===> %s', inputPath, outputPath);
        // clean.
//        self._clean();
        return result;
    },
    isExcluded: function(file){
        var self = this;
        for(var i = 0; i < self._config.exclude.length; i++){
            if(file.match(self._config.exclude[i])){
                return true;
            }
        }
        return false;
    },
    isFileIgnored: function(filePath){
        var self = this;
        for(var i = 0; i < self._config.ignoreFiles.length; i++){
            if(filePath.match(self._config.ignoreFiles[i])){
                return true;
            }
        }
        return false;
    },
    getModulePath: function(moduleName){
        var self = this;
        for(var i = 0; i < self._config.packages.length; i++){
            var pkg = self._config.packages[i],
                module = moduleName.match(new RegExp(pkg.name + '\/(.*)'));
            if(module && module[1]){
                var modulePath = path.resolve(pkg.path, module[1].replace(/\.js/, '') + '.js');
                if(fs.existsSync(modulePath)){
                    return modulePath;
                }
            }
        }
        return false;
    }
};

module.exports = {
    config: function(cfg){
        var config = ModuleCompiler._config;
        if(cfg){
            config = ModuleCompiler._parseConfig(cfg);
        }
        config.packages = [];
        for(var pkg in ModuleCompiler._packages){
            config.packages.push(ModuleCompiler._packages[pkg]);
        }
        return config;
    },
    /**
     * analyze the modules in a file.
     * @param inputPath
     * @return {Object}
     */
    analyze: function(inputPath){
        return ModuleCompiler.analyze(inputPath);
    },
    /**
     * build a file or a directory
     * @param inputPath {String} the source file location.
     * @param outputPath {String} the combined file location.
     * @param outputCharset {String} the combined file charset. default to 'utf-8'
     * @return {Object}
     */
    build: function(inputPath, outputPath, outputCharset){
        var target = path.resolve(inputPath),
            result = {
                'success': true,
                'files': []
            };
        if(fs.existsSync(target)){
            if(fs.statSync(target).isDirectory()) {
                var targets = fs.readdirSync(target);
                for (var i in targets) {
                    if(!ModuleCompiler.isFileIgnored(targets[i])){
                        var inputFile = path.resolve(target, targets[i]),
                            outputFile = path.join(outputPath, targets[i]);
                        if(path.extname(inputFile)==='.js') {
                            result.files.push(ModuleCompiler.build(inputFile, outputFile, outputCharset));
                        }
                    }
                }
            } else {
                result.files.push(ModuleCompiler.build(target, outputPath, outputCharset));
            }
        }else{
            // MC.build('pkgName/abc');
            var modulePath = ModuleCompiler.getModulePath(inputPath);
            if(modulePath){
                result.files.push(ModuleCompiler.build(modulePath, outputPath, outputCharset));
            }else{
                result.success = false;
                !ModuleCompiler._config.silent && console.info('[err]'.bold.red + ' cannot find target: %s', target);
            }
        }
        return result;
    },
    clean: function(){
        ModuleCompiler._config = {
            exclude: [],
            ignoreFiles: [],
            suffix: '',
            charset: '',
            combine: false,
            silent: false
        };
        ModuleCompiler._packages = {};
        ModuleCompiler._mappedRules = [];
        ModuleCompiler._clean();
    }
};
