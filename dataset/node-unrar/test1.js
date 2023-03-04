var Unrar = require('node-unrar');

var rar = new Unrar('test.rar');

/// Create '/path/to/dest/' before rar.extract()

rar.extract('./', null, function (err) {
    //file extracted successfully.
});
