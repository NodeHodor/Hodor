/**
 *
 * @author: 橘子<daxingplay@gmail.com>
 * @time: 13-3-13 10:53
 * @description:
 */

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

function addPkgNameToPath(pkgPath, pkgName){
    if(pkgName){
        var basename = path.basename(pkgPath).replace(/(\\|\/)$/, '');
        if(basename != pkgName){
            pkgPath = path.normalize(path.join(pkgPath, pkgName));
        }
    }
    return pkgPath;
}

module.exports = {
    getPackage: function(){},
    parse: function(cfg, config){
        // TODO KISSY 1.3 package.
        config = config || {};
        config = _.extend(config, cfg);
        if(cfg.packages){
            config.pkgs = config.pkgs || {};
            var isArrayFormat = _.isArray(cfg.packages);
            _.forEach(cfg.packages, function(pkg, index){
                if(!isArrayFormat){
                    pkg.name = index;
                    pkg.path = pkg.base;
                }
                if(_.isUndefined(pkg.charset)){
                    // if left blank, node will treat it as utf-8
                    pkg.charset = 'utf8';
                }
                pkg.path = path.resolve(pkg.path) || __dirname;
                pkg.combine = !!pkg.combine;

                //如果是ignorePackageNameInUri忽略pagename
                var name = pkg.ignorePackageNameInUri ? '' : pkg.name;
                
                if(fs.existsSync(path.resolve(pkg.path, name))){
                    config.pkgs[pkg.name] = pkg;
                }
            });
        }
        if(cfg.map && _.isArray(cfg.map)){
            for(var i = 0; i < cfg.map.length; i++){
                var curMap = cfg.map[i];
                if(_.isArray(curMap) && !_.isUndefined(curMap[0]) && !_.isUndefined(curMap[1])){
                    cfg.map[i] = curMap;
                }
            }
        }else{
            cfg.map = [];
        }
        _.defaults(config, {
            suffix: '',
            silent: true,
            exclude: [],
            charset: 'utf8',
            debug: false
        });
        return config;
    },
    check: function(config, inputFile){
        if(_.isEmpty(config.packages)){
            var fileDir = path.dirname(inputFile);
            config.packages = [{
                name: path.basename(fileDir),
                path: path.resolve(fileDir),
                charset: ''
            }];
        }
        return config;
    }
};
