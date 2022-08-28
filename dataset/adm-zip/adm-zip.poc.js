var AdmZip = require('adm-zip');
var zip = new AdmZip("./zip-slip.zip");
zip.extractAllTo("/tmp/safe");
