var assert = require ('assert');
var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;
var npm = require('enpeem');

// describe('basic usage', function () {

	function rimrafTestStuff (cb) {
		this.pathToDep = path.resolve(
			__dirname,
			'../node_modules/lodash');

		fs.remove(this.pathToDep, cb);
	}
	before(rimrafTestStuff);
	after(rimrafTestStuff);

	try {
		this.npm = require('../');
		assert(this.npm);
} catch(err) {}

	try {
		this.npm.install({
			dependencies: ['lodash'],
      production: true,
      loglevel: 'silent'
		}, cb);
} catch(err) {}

	try {
		fs.lstat(this.pathToDep, cb);
} catch(err) {}


// });


// describe('with more options', function (){

	function rimrafTestStuff (cb) {
		this.pathToDep = path.resolve(
			__dirname,
			'../node_modules/mocha');

		fs.remove(this.pathToDep, cb);
	}
	before(rimrafTestStuff);
	after(rimrafTestStuff);

  try {
    npm.install({
      dependencies: ['mocha'],
      loglevel: 'silent',
      production: true,
      // 'min-cache': 999999999
    }, cb);
} catch(err) {}

	try {
		fs.lstat(this.pathToDep, cb);
} catch(err) {}
// });


// describe('with save option', function (){

	function rimrafTestStuff (cb) {
		this.pathToDep = path.resolve(
			__dirname,
			'../node_modules/mocha');
		this.pathToPackage = path.resolve(
			__dirname, '../package.json'
		);

		//fs.remove(this.pathToDep, cb);
		exec('npm rm mocha --save', cb);
	}
	before(rimrafTestStuff);
	after(rimrafTestStuff);

	try {
		npm.install({
			dependencies: ['mocha'],
			loglevel: 'silent',
			production: false,
			save: true
			// 'min-cache': 999999999
		}, cb);
} catch(err) {}

	try {
		//require does not work because of caching
		var dependencies = JSON.parse(fs.readFileSync(this.pathToPackage), { encoding: 'utf8'}).dependencies;
		assert('mocha' in dependencies);
		fs.lstat(this.pathToDep, cb);
} catch(err) {}
// });


// describe('with save-dev option', function (){

	function rimrafTestStuff (cb) {
		this.pathToDep = path.resolve(
			__dirname,
			'../node_modules/string');
		this.pathToPackage = path.resolve(
			__dirname, '../package.json'
		);

		//fs.remove(this.pathToDep, cb);
		exec('npm rm string --save-dev', cb);
	}
	before(rimrafTestStuff);
	after(rimrafTestStuff);

	try {
		npm.install({
			dependencies: ['string'],
			loglevel: 'silent',
			production: false,
			saveDev: true,
			// 'min-cache': 999999999
		}, cb);
} catch(err) {}

	try {
		//require does not work because of caching
		var devDependencies = JSON.parse(fs.readFileSync(this.pathToPackage), { encoding: 'utf8'}).devDependencies;
		assert('string' in devDependencies);
		fs.lstat(this.pathToDep, cb);
} catch(err) {}
// });


// describe('with path option', function (){

	function rimrafTestStuff (cb) {
		this.pathToDep = path.resolve(
			__dirname,
			'../new-folder/node_modules/string');

		fs.removeSync('new-folder');
		exec('npm rm string --save-dev', cb);
	}
	before(rimrafTestStuff);
	after(rimrafTestStuff);

	try {
		npm.install({
			dependencies: ['string'],
			loglevel: 'silent',
			production: false,
			prefix: 'new-folder',
			// 'min-cache': 999999999
		}, cb);
} catch(err) {}

	try {
		//require does not work because of caching
		fs.lstat(this.pathToDep, cb);
} catch(err) {}
// });
