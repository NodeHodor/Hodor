const acorn = require("acorn");
const acornLoose = require("acorn-loose");
const jsx = require("acorn-jsx");

const fs = require("fs");
const path = require('path');

filePath = "./fs";

property = {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowReserved: false,
    allowReturnOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowAwaitOutsideFunction: false,
    allowHashBang: false,
    locations: true,
    loose: false,
    ranges: false,
    preserveParens: false,
    'plugins.jsx': true,
  };


var arguments = process.argv;
if (arguments[2] && arguments[3]){
  var input_filename = arguments[2];
  var output_filename = arguments[3];

  var file = fs.readFileSync(input_filename, "utf-8");
  try {
    ast = acorn.parse(file, property);
    fs.writeFileSync(output_filename, JSON.stringify(ast));
  } catch(e) {
    console.log(e);
  }
}
