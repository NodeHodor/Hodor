﻿var fs = require('fs'),
    path = require('path');

// 创建所有目录
module.exports = {
    mkdirs:function (dirpath, mode, callback) {
        if (typeof mode === 'function') {
            callback = mode;
        }

        fs.exists(dirpath, function (exists) {
            if (exists) {
                callback(dirpath);
            } else {
                //尝试创建父目录，然后再创建当前目录
                module.exports.mkdirs(path.dirname(dirpath), mode, function () {
                    fs.mkdir(dirpath, mode, callback);
                });
            }
        });
    },
    mkdirsSync:function (dirpath, mode) {
        if(!fs.existsSync(dirpath)) {
            //尝试创建父目录，然后再创建当前目录
            module.exports.mkdirsSync(path.dirname(dirpath), mode);
            fs.mkdirSync(dirpath, mode);
        }
    },
    rmdirsSync: function(dirPath){
        var self = this;
        dirPath = path.resolve(dirPath);
        if (!fs.existsSync(dirPath)) {
            return;
        }

        var files = fs.readdirSync(dirPath);

        files.forEach(function(file) {
            var full_p = path.resolve(dirPath, file);
            if (fs.statSync(full_p).isDirectory()) {
                self.rmdirsSync(full_p);
                return;
            }
            fs.unlinkSync(full_p);
        });

        fs.rmdirSync(dirPath);
    }
};