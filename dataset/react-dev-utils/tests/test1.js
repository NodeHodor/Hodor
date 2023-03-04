var getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');

getCacheIdentifier('prod', ['react-dev-utils', 'chalk']); // # => 'prod:react-dev-utils@5.0.0:chalk@3.0.0'


const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

var getProcessForPort = require('react-dev-utils/getProcessForPort');

getProcessForPort(3000);

var webpack = require('webpack');
var config = require('../config/webpack.config.dev');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

var compiler = webpack(config);

compiler.hooks.invalid.tap('invalid', function () {
  console.log('Compiling...');
});

compiler.hooks.done.tap('done', function (stats) {
  var rawMessages = stats.toJson({}, true);
  var messages = formatWebpackMessages(rawMessages);
  if (!messages.errors.length && !messages.warnings.length) {
    console.log('Compiled successfully!');
  }
  if (messages.errors.length) {
    console.log('Failed to compile.');
    messages.errors.forEach(e => console.log(e));
    return;
  }
  if (messages.warnings.length) {
    console.log('Compiled with warnings.');
    messages.warnings.forEach(w => console.log(w));
  }
});