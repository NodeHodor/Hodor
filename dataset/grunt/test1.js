var grunt = require('grunt');

console.log(grunt.file.readYAML('test.yaml'));

'use strict';

var actual, expected, key, value;
var flatten = grunt.util._.flatten;

key = 'dist/built.js';
value = 'src/*1.js';
actual = grunt.task.normalizeMultiTaskFiles(value, key);
expected = [
  {
    dest: 'dist/built.js',
    src: ['src/file1.js'],
    orig: {dest: key, src: [value]},
  },
];
// test.deepEqual(actual, expected, 'should normalize destTarget: srcString.');

key = 'dist/built.js';
value = [['src/*1.js'], ['src/*2.js']];
actual = grunt.task.normalizeMultiTaskFiles(value, key);
expected = [
  {
    dest: 'dist/built.js',
    src: ['src/file1.js', 'src/file2.js'],
    orig: {dest: key, src: flatten(value)},
  },
];
// test.deepEqual(actual, expected, 'should normalize destTarget: srcArray.');

value = {
  src: ['src/*1.js', 'src/*2.js'],
  dest: 'dist/built.js'
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/built.js',
    src: ['src/file1.js', 'src/file2.js'],
    orig: value,
  },
];
// test.deepEqual(actual, expected, 'should normalize target: {src: srcStuff, dest: destStuff}.');

value = {
  files: {
    'dist/built-a.js': 'src/*1.js',
    'dist/built-b.js': ['src/*1.js', [['src/*2.js']]]
  }
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/built-a.js',
    src: ['src/file1.js'],
    orig: {dest: 'dist/built-a.js', src: [value.files['dist/built-a.js']]},
  },
  {
    dest: 'dist/built-b.js',
    src: ['src/file1.js', 'src/file2.js'],
    orig: {dest: 'dist/built-b.js', src: flatten(value.files['dist/built-b.js'])},
  },
];
// test.deepEqual(actual, expected, 'should normalize target: {files: {destTarget: srcStuff, ...}}.');

value = {
  files: [
    {'dist/built-a.js': 'src/*.whoops'},
    {'dist/built-b.js': [[['src/*1.js'], 'src/*2.js']]}
  ]
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/built-a.js',
    src: [],
    orig: {dest: Object.keys(value.files[0])[0], src: [value.files[0]['dist/built-a.js']]},
  },
  {
    dest: 'dist/built-b.js',
    src: ['src/file1.js', 'src/file2.js'],
    orig: {dest: Object.keys(value.files[1])[0], src: flatten(value.files[1]['dist/built-b.js'])},
  },
];
// test.deepEqual(actual, expected, 'should normalize target: {files: [{destTarget: srcStuff}, ...]}.');

value = {
  files: [
    {dest: 'dist/built-a.js', src: ['src/*2.js']},
    {dest: 'dist/built-b.js', src: ['src/*1.js', 'src/*2.js']}
  ]
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/built-a.js',
    src: ['src/file2.js'],
    orig: value.files[0],
  },
  {
    dest: 'dist/built-b.js',
    src: ['src/file1.js', 'src/file2.js'],
    orig: value.files[1],
  },
];
// test.deepEqual(actual, expected, 'should normalize target: {files: [{src: srcStuff, dest: destStuff}, ...]}.');

value = {
  files: [
    {dest: 'dist/built-a.js', src: ['src/*2.js'], foo: 123, bar: true},
    {dest: 'dist/built-b.js', src: ['src/*1.js', 'src/*2.js'], foo: 456, bar: null}
  ]
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/built-a.js',
    src: ['src/file2.js'],
    foo: 123,
    bar: true,
    orig: value.files[0],
  },
  {
    dest: 'dist/built-b.js',
    src: ['src/file1.js', 'src/file2.js'],
    foo: 456,
    bar: null,
    orig: value.files[1],
  },
];
// test.deepEqual(actual, expected, 'should propagate extra properties.');

// test.done();
// },
// 'nonull': function(test) {
// test.expect(2);
var actual, expected, value;

value = {
  src: ['src/xxx*.js', 'src/yyy*.js'],
  dest: 'dist/built.js',
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: value.dest,
    src: [],
    orig: value,
  },
];
// test.deepEqual(actual, expected, 'if nonull is not set, should not include non-matching patterns.');

value = {
  src: ['src/xxx*.js', 'src/yyy*.js'],
  dest: 'dist/built.js',
  nonull: true,
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: value.dest,
    src: value.src,
    nonull: true,
    orig: value,
  },
];
//   test.deepEqual(actual, expected, 'if nonull is set, should include non-matching patterns.');
//   test.done();
// },
// 'expandMapping': function(test) {
// test.expect(3);
var actual, expected, value;

value = {
  files: [
    {dest: 'dist/', src: ['src/file?.js'], expand: true},
    {dest: 'dist/', src: ['file?.js'], expand: true, cwd: 'src'},
  ]
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/src/file1.js', src: ['src/file1.js'],
    orig: value.files[0],
  },
  {
    dest: 'dist/src/file2.js', src: ['src/file2.js'],
    orig: value.files[0],
  },
  {
    dest: 'dist/file1.js', src: ['src/file1.js'],
    orig: value.files[1],
  },
  {
    dest: 'dist/file2.js', src: ['src/file2.js'],
    orig: value.files[1],
  },
];
// test.deepEqual(actual, expected, 'expand to file mapping, removing cwd from destination paths.');

value = {
  files: [
    {dest: 'dist/', src: ['src/file?.js'], expand: true, flatten: true},
  ]
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/file1.js', src: ['src/file1.js'],
    orig: value.files[0],
  },
  {
    dest: 'dist/file2.js', src: ['src/file2.js'],
    orig: value.files[0],
  },
];
// test.deepEqual(actual, expected, 'expand to file mapping, flattening destination paths.');

value = {
  files: [
    {
      dest: 'dist/',
      src: ['src/file?.js'],
      expand: true,
      rename: function(destBase, destPath) {
        return destBase + 'min/' + destPath.replace(/(\.js)$/, '.min$1');
      },
    },
  ]
};
actual = grunt.task.normalizeMultiTaskFiles(value, 'ignored');
expected = [
  {
    dest: 'dist/min/src/file1.min.js', src: ['src/file1.js'],
    orig: value.files[0],
  },
  {
    dest: 'dist/min/src/file2.min.js', src: ['src/file2.js'],
    orig: value.files[0],
  },
];

// var grunt = require('../../lib/grunt');

// exports.config = {
//   setUp: function(done) {
//     this.origData = grunt.config.data;
    grunt.config.init({
      meta: grunt.file.readJSON('test/fixtures/test.json'),
      foo: '<%= meta.foo %>',
      foo2: '<%= foo %>',
      obj: {
        foo: '<%= meta.foo %>',
        foo2: '<%= obj.foo %>',
        Arr: ['foo', '<%= obj.foo2 %>'],
        arr2: ['<%= arr %>', '<%= obj.Arr %>'],
      },
      bar: 'bar',
      arr: ['foo', '<%= obj.foo2 %>'],
      arr2: ['<%= arr %>', '<%= obj.Arr %>'],
      buffer: Buffer.from('test'),
    });
//     done();
//   },
//   tearDown: function(done) {
//     grunt.config.data = this.origData;
//     done();
//   },
grunt.config.escape('foo')
grunt.config.escape('foo.bar.baz')
//   'config.escape': function(test) {
//     test.expect(2);
//     grunt.config.escape('foo'), 'foo', 'Should do nothing if no . chars.');
//     grunt.config.escape('foo.bar.baz'), 'foo\\.bar\\.baz', 'Should escape all . chars.');
//     test.done();
//   },
grunt.config.getPropString('foo')
grunt.config.getPropString('foo.bar.baz')
grunt.config.getPropString(['foo', 'bar'])
grunt.config.getPropString(['foo.bar', 'baz.qux.zip'])
//   'config.getPropString': function(test) {
//     test.expect(4);
//     grunt.config.getPropString('foo'), 'foo', 'Should do nothing if already a string.');
//     grunt.config.getPropString('foo.bar.baz'), 'foo.bar.baz', 'Should do nothing if already a string.');
//     grunt.config.getPropString(['foo', 'bar']), 'foo.bar', 'Should join parts into a dot-delimited string.');
//     grunt.config.getPropString(['foo.bar', 'baz.qux.zip']), 'foo\\.bar.baz\\.qux\\.zip', 'Should join parts into a dot-delimited string, escaping . chars in parts.');
//     test.done();
//   },
//   'config.getRaw': function(test) {
//     test.expect(4);
grunt.config.getRaw('foo')
grunt.config.getRaw('obj.foo2')
grunt.config.getRaw(['obj', 'foo2'])
grunt.config.getRaw('arr')
//     test.done();
//   },
//   'config.process': function(test) {
//     test.expect(7);
grunt.config.process('<%= meta.foo %>')
grunt.config.process('<%= foo %>')
grunt.config.process('<%= obj.foo %>')
grunt.config.process(['foo', '<%= obj.foo2 %>'])
grunt.config.process(['<%= arr %>', '<%= obj.Arr %>'])
var buf = grunt.config.process('<%= buffer %>')
//     test.done();
//   },
//   'config.get': function(test) {
//     test.expect(10);
grunt.config.get('foo')
grunt.config.get('foo2')
grunt.config.get('obj.foo2')
grunt.config.get(['obj', 'foo2'])
grunt.config.get('arr')
grunt.config.get('obj.Arr')
grunt.config.get('arr2')
grunt.config.get(['obj', 'arr2'])
var buf = grunt.config.get('buffer');
Buffer.isBuffer(buf)
//     test.done();
//   },
//   'config.set': function(test) {
//     test.expect(6);
grunt.config.set('foo3', '<%= foo2 %>')
grunt.config.getRaw('foo3')
grunt.config.data.foo3
grunt.config.set('a.b.c', '<%= foo2 %>')
grunt.config.getRaw('a.b.c')
grunt.config.data.a.b.c
//     test.done();
//   },
//   'config.merge': function(test) {
//     test.expect(4);
grunt.config.merge({})
grunt.config.set('obj', {a: 12})
grunt.config.merge({
    foo: 'test',
    baz: '123',
    obj: {a: 34, b: 56},
});
grunt.config.getRaw('foo')
grunt.config.getRaw('baz')
grunt.config.getRaw('obj')
//     test.done();
//   },
//   'config': function(test) {
//     test.expect(10);
grunt.config('foo')
grunt.config('obj.foo2')
grunt.config(['obj', 'foo2'])
grunt.config('arr')

grunt.config('foo3', '<%= foo2 %>')
grunt.config.getRaw('foo3')
grunt.config.data.foo3,
grunt.config('a.b.c', '<%= foo2 %>')
grunt.config.getRaw('a.b.c')
grunt.config.data.a.b.c
//     test.done();
//   },
//   'config.requires': function(test) {
//     test.expect(8);

//     test.done();
//   },
// };


grunt.event.on('test.foo', function(a, b, c) {
});
grunt.event.on('test.*', function(a, b, c) {
// This should get executed twice (emit test.foo and test.bar).
});
grunt.event.emit('test.foo', '1', '2', '3');
grunt.event.emit('test.bar', '1', '2', '3');


// var fs = require('fs');
var path = require('path');

// var Tempfile = require('temporary/lib/file');
// var Tempdir = require('temporary/lib/dir');

// var win32 = process.platform === 'win32';

// var tmpdir = new Tempdir();
// try {
//   fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join("./tests", 'octocat.png'), 'file');
//   fs.symlinkSync(path.resolve('test/fixtures/expand'), path.join("./tests", 'expand'), 'dir');
// } catch (err) {
//   console.error('** ERROR: Cannot create symbolic links; link-related tests will fail.');
//   if (win32) {
//     console.error('** Tests must be run with Administrator privileges on Windows.');
//   }
// }

// exports['file.match'] = {
//   'empty set': function(test) {
//     test.expect(12);
//     // Should return empty set if a required argument is missing or an empty set.
grunt.file.match(null, null);
grunt.file.match({}, null, null);
grunt.file.match(null, 'foo.js');
grunt.file.match('*.js', null);
grunt.file.match({}, null, 'foo.js');
grunt.file.match({}, '*.js', null);
grunt.file.match({}, [], 'foo.js');
grunt.file.match({}, '*.js', []);
grunt.file.match(null, ['foo.js']);
grunt.file.match(['*.js'], null);
grunt.file.match({}, null, ['foo.js']);
grunt.file.match({}, ['*.js'], null);
//     test.done();
//   },
//   'basic matching': function(test) {
//     test.expect(6);
grunt.file.match('*.js', 'foo.js');
grunt.file.match('*.js', ['foo.js']);
grunt.file.match('*.js', ['foo.js', 'bar.css']);
grunt.file.match(['*.js', '*.css'], 'foo.js');
grunt.file.match(['*.js', '*.css'], ['foo.js']);
grunt.file.match(['*.js', '*.css'], ['foo.js', 'bar.css']);
//     test.done();
//   },
//   'no matches': function(test) {
//     test.expect(2);
grunt.file.match('*.js', 'foo.css');
grunt.file.match('*.js', ['foo.css', 'bar.css']);
//     test.done();
//   },
//   'unique': function(test) {
//     test.expect(2);
grunt.file.match('*.js', ['foo.js', 'foo.js']);
grunt.file.match(['*.js', '*.*'], ['foo.js', 'foo.js']);
//     test.done();
//   },
//   'flatten': function(test) {
//     test.expect(1);
grunt.file.match([['*.js', '*.css'], ['*.*', '*.js']], ['foo.js', 'bar.css']);
//     test.done();
//   },
//   'exclusion': function(test) {
//     test.expect(5);
grunt.file.match(['!*.js'], ['foo.js', 'bar.js']);
grunt.file.match(['*.js', '!*.js'], ['foo.js', 'bar.js']);
grunt.file.match(['*.js', '!f*.js'], ['foo.js', 'bar.js', 'baz.js']);
grunt.file.match(['*.js', '!*.js', 'b*.js'], ['foo.js', 'bar.js', 'baz.js']);
grunt.file.match(['*.js', '!f*.js', '*.js'], ['foo.js', 'bar.js', 'baz.js']);
//     test.done();
//   },
//   'options.matchBase': function(test) {
//     test.expect(2);
grunt.file.match({matchBase: true}, '*.js', ['foo.js', 'bar', 'baz/xyz.js']);
grunt.file.match('*.js', ['foo.js', 'bar', 'baz/xyz.js']);
//     test.done();
//   }
// };

// exports['file.isMatch'] = {
//   'basic matching': function(test) {
//     test.expect(6);
//     grunt.file.isMatch('*.js', 'foo.js'), 'should match correctly.');
//     grunt.file.isMatch('*.js', ['foo.js']), 'should match correctly.');
//     grunt.file.isMatch('*.js', ['foo.js', 'bar.css']), 'should match correctly.');
//     grunt.file.isMatch(['*.js', '*.css'], 'foo.js'), 'should match correctly.');
//     grunt.file.isMatch(['*.js', '*.css'], ['foo.js']), 'should match correctly.');
//     grunt.file.isMatch(['*.js', '*.css'], ['foo.js', 'bar.css']), 'should match correctly.');
//     test.done();
//   },
//   'no matches': function(test) {
//     test.expect(6);
//     grunt.file.isMatch('*.js', 'foo.css'), false, 'should fail to match.');
//     grunt.file.isMatch('*.js', ['foo.css', 'bar.css']), false, 'should fail to match.');
//     grunt.file.isMatch(null, 'foo.css'), false, 'should fail to match.');
//     grunt.file.isMatch('*.js', null), false, 'should fail to match.');
//     grunt.file.isMatch([], 'foo.css'), false, 'should fail to match.');
//     grunt.file.isMatch('*.js', []), false, 'should fail to match.');
//     test.done();
//   },
//   'options.matchBase': function(test) {
//     test.expect(2);
//     grunt.file.isMatch({matchBase: true}, '*.js', ['baz/xyz.js']), 'should matchBase (minimatch) when specified.');
//     grunt.file.isMatch('*.js', ['baz/xyz.js']), false, 'should not matchBase (minimatch) by default.');
//     test.done();
//   }
// };

// exports['file.expand*'] = {
//   setUp: function(done) {
//     this.cwd = process.cwd();
//     process.chdir('test/fixtures/expand');
//     done();
//   },
//   tearDown: function(done) {
//     process.chdir(this.cwd);
//     done();
//   },
//   'basic matching': function(test) {
//     test.expect(8);
grunt.file.expand('**/*.js');
grunt.file.expand('**/*.js', '**/*.css');
grunt.file.expand(['**/*.js', '**/*.css']);
grunt.file.expand('**d*/**');
//       'deep',
//       'deep/deep.txt',
//       'deep/deeper',
//       'deep/deeper/deeper.txt',
//       'deep/deeper/deepest',
//       'deep/deeper/deepest/deepest.txt'], 'should match files and directories.');
grunt.file.expand({mark: true}, '**d*/**');
//       'deep/',
//       'deep/deep.txt',
//       'deep/deeper/',
//       'deep/deeper/deeper.txt',
//       'deep/deeper/deepest/',
//       'deep/deeper/deepest/deepest.txt'], 'the minimatch "mark" option ensures directories end in /.');
grunt.file.expand('**d*/**/');
//       'deep/',
//       'deep/deeper/',
//       'deep/deeper/deepest/'], 'should match directories, arbitrary / at the end appears in matches.');
grunt.file.expand({mark: true}, '**d*/**/');
//       'deep/',
//       'deep/deeper/',
//       'deep/deeper/deepest/'], 'should match directories, arbitrary / at the end appears in matches.');
grunt.file.expand('*.xyz');
//     test.done();
//   },
//   'filter': function(test) {
//     test.expect(5);
grunt.file.expand({filter: 'isFile'}, '**d*/**');
//       'deep/deep.txt',
//       'deep/deeper/deeper.txt',
//       'deep/deeper/deepest/deepest.txt'
//     ], 'should match files only.');
grunt.file.expand({filter: 'isDirectory'}, '**d*/**');
//       'deep',
//       'deep/deeper',
//       'deep/deeper/deepest'
//     ], 'should match directories only.');
grunt.file.expand({filter: function(filepath) { return (/deepest/).test(filepath); }}, '**');
//       'deep/deeper/deepest',
//       'deep/deeper/deepest/deepest.txt',
//     ], 'should filter arbitrarily.');
grunt.file.expand({filter: 'isFile'}, 'js', 'css');
grunt.file.expand({filter: 'isDirectory'}, '**/*.js');
//     test.done();
//   },
//   'unique': function(test) {
//     test.expect(4);
grunt.file.expand('**/*.js', 'js/*.js');
grunt.file.expand('**/*.js', '**/*.css', 'js/*.js');
grunt.file.expand('js', 'js/');
grunt.file.expand({mark: true}, 'js', 'js/');
//     test.done();
//   },
//   'file order': function(test) {
//     test.expect(4);
//     var actual = grunt.file.expand('**/*.{js,css}');
//     var expected = ['css/baz.css', 'css/qux.css', 'js/bar.js', 'js/foo.js'];
// //actual, expected, 'should select 4 files in this order, by default.');

//     actual = grunt.file.expand('js/foo.js', 'js/bar.js', '**/*.{js,css}');
//     expected = ['js/foo.js', 'js/bar.js', 'css/baz.css', 'css/qux.css'];
// //actual, expected, 'specifically-specified-up-front file order should be maintained.');

//     actual = grunt.file.expand('js/bar.js', 'js/foo.js', '**/*.{js,css}');
//     expected = ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'];
// //actual, expected, 'specifically-specified-up-front file order should be maintained.');

//     actual = grunt.file.expand('js/foo.js', '**/*.{js,css}', '!js/bar.js', 'js/bar.js');
//     expected = ['js/foo.js', 'css/baz.css', 'css/qux.css', 'js/bar.js'];
// //actual, expected, 'if a file is excluded and then re-added, it should be added at the end.');
//     test.done();
//   },
//   'flatten': function(test) {
//     test.expect(1);
grunt.file.expand([['**/*.js'], ['**/*.css', 'js/*.js']]);
//     test.done();
//   },
//   'exclusion': function(test) {
//     test.expect(8);
grunt.file.expand(['!js/*.js']);
grunt.file.expand(['js/bar.js', '!js/bar.js']);
grunt.file.expand(['**/*.js', '!js/foo.js']);
grunt.file.expand(['!js/foo.js', '**/*.js']);
grunt.file.expand(['**/*.js', '**/*.css', '!js/bar.js', '!css/baz.css']);
grunt.file.expand(['**/*.js', '**/*.css', '!**/*.css']);
grunt.file.expand(['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css', '!**/b*.*']);
grunt.file.expand(['js/bar.js', '!**/b*.*', 'js/foo.js', 'css/baz.css', 'css/qux.css']);
//     test.done();
//   },
//   'options.matchBase': function(test) {
//     test.expect(4);
var opts = {matchBase: true};
grunt.file.expand('*.js');
grunt.file.expand(opts, '*.js');
grunt.file.expand(opts, '*.js', '*.css');
grunt.file.expand(opts, ['*.js', '*.css']);
//     test.done();
//   },
//   'options.cwd': function(test) {
//     test.expect(4);
var cwd = path.resolve(process.cwd(), '..');
grunt.file.expand({cwd: cwd}, ['expand/js', 'expand/js/*']);
grunt.file.expand({cwd: cwd, filter: 'isFile'}, ['expand/js', 'expand/js/*']);
grunt.file.expand({cwd: cwd, filter: 'isDirectory'}, ['expand/js', 'expand/js/*']);
grunt.file.expand({cwd: cwd, filter: 'isFile'}, ['expand/js', 'expand/js/*', '!**/b*.js']);
//     test.done();
//   },
//   'options.nonull': function(test) {
//     test.expect(2);
var opts = {nonull: true};
grunt.file.expand(opts, ['js/a*', 'js/b*', 'js/c*']);
grunt.file.expand(opts, ['js/foo.js', 'js/bar.js', 'js/baz.js']);
//     test.done();
//   },
// };

// exports['file.expandMapping'] = {
//   setUp: function(done) {
//     this.cwd = process.cwd();
//     process.chdir('test/fixtures');
//     done();
//   },
//   tearDown: function(done) {
//     process.chdir(this.cwd);
//     done();
//   },
//   'basic matching': function(test) {
//     test.expect(2);

    var actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest');
    var expected = [
      {dest: 'dest/expand/deep/deep.txt', src: ['expand/deep/deep.txt']},
      {dest: 'dest/expand/deep/deeper/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
      {dest: 'dest/expand/deep/deeper/deepest/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
    ];

    actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest/');

//     test.done();
//   },
//   'flatten': function(test) {
//     test.expect(1);
    var actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest', {flatten: true});
    var expected = [
      {dest: 'dest/deep.txt', src: ['expand/deep/deep.txt']},
      {dest: 'dest/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
      {dest: 'dest/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
    ];
//actual, expected, 'dest paths should be flattened pre-destBase+destPath join');
//     test.done();
//   },
//   'ext': function(test) {
//     test.expect(3);
    var actual, expected;
    actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest', {ext: '.foo'});
    expected = [
      {dest: 'dest/expand/deep/deep.foo', src: ['expand/deep/deep.txt']},
      {dest: 'dest/expand/deep/deeper/deeper.foo', src: ['expand/deep/deeper/deeper.txt']},
      {dest: 'dest/expand/deep/deeper/deepest/deepest.foo', src: ['expand/deep/deeper/deepest/deepest.txt']},
    ];
//actual, expected, 'specified extension should be added');
    actual = grunt.file.expandMapping(['expand-mapping-ext/**/file*'], 'dest', {ext: '.foo'});
    expected = [
      {dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo', src: ['expand-mapping-ext/dir.ectory/file-no-extension']},
      {dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.foo', src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']},
      {dest: 'dest/expand-mapping-ext/file.foo', src: ['expand-mapping-ext/file.ext.ension']},
    ];
//actual, expected, 'specified extension should be added');
    actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest', {ext: ''});
    expected = [
      {dest: 'dest/expand/deep/deep', src: ['expand/deep/deep.txt']},
      {dest: 'dest/expand/deep/deeper/deeper', src: ['expand/deep/deeper/deeper.txt']},
      {dest: 'dest/expand/deep/deeper/deepest/deepest', src: ['expand/deep/deeper/deepest/deepest.txt']},
    ];
//actual, expected, 'empty string extension should be added');
//     test.done();
//   },
//   'extDot': function(test) {
//     test.expect(2);
//     var actual, expected;

    actual = grunt.file.expandMapping(['expand-mapping-ext/**/file*'], 'dest', {ext: '.foo', extDot: 'first'});
    expected = [
      {dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo', src: ['expand-mapping-ext/dir.ectory/file-no-extension']},
      {dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.foo', src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']},
      {dest: 'dest/expand-mapping-ext/file.foo', src: ['expand-mapping-ext/file.ext.ension']},
    ];
//actual, expected, 'extDot of "first" should replace everything after the first dot in the filename.');

    actual = grunt.file.expandMapping(['expand-mapping-ext/**/file*'], 'dest', {ext: '.foo', extDot: 'last'});
    expected = [
      {dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo', src: ['expand-mapping-ext/dir.ectory/file-no-extension']},
      {dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.foo', src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']},
      {dest: 'dest/expand-mapping-ext/file.ext.foo', src: ['expand-mapping-ext/file.ext.ension']},
    ];
//actual, expected, 'extDot of "last" should replace everything after the last dot in the filename.');

//     test.done();
//   },
//   'cwd': function(test) {
//     test.expect(1);
    var actual = grunt.file.expandMapping(['**/*.txt'], 'dest', {cwd: 'expand'});
    var expected = [
      {dest: 'dest/deep/deep.txt', src: ['expand/deep/deep.txt']},
      {dest: 'dest/deep/deeper/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
      {dest: 'dest/deep/deeper/deepest/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
    ];
//actual, expected, 'cwd should be stripped from front of destPath, pre-destBase+destPath join');
//     test.done();
//   },
//   'rename': function(test) {
//     test.expect(1);
    var actual = grunt.file.expandMapping(['**/*.txt'], 'dest', {
      cwd: 'expand',
      flatten: true,
      rename: function(destBase, destPath, options) {
        return path.join(destBase, options.cwd, 'o-m-g', destPath);
      }
    });
//     var expected = [
//       {dest: 'dest/expand/o-m-g/deep.txt', src: ['expand/deep/deep.txt']},
//       {dest: 'dest/expand/o-m-g/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
//       {dest: 'dest/expand/o-m-g/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
//     ];
//actual, expected, 'custom rename function should be used to build dest, post-flatten');
//     test.done();
//   },
//   'rename to same dest': function(test) {
//     test.expect(1);
    var actual = grunt.file.expandMapping(['**/*'], 'dest', {
      filter: 'isFile',
      cwd: 'expand',
      flatten: true,
      nosort: true,
      rename: function(destBase, destPath) {
        return path.join(destBase, 'all' + path.extname(destPath));
      }
    });
//     var expected = [
//       {dest: 'dest/all.md', src: ['expand/README.md']},
//       {dest: 'dest/all.css', src: ['expand/css/baz.css', 'expand/css/qux.css']},
//       {dest: 'dest/all.txt', src: ['expand/deep/deep.txt', 'expand/deep/deeper/deeper.txt', 'expand/deep/deeper/deepest/deepest.txt']},
//       {dest: 'dest/all.js', src: ['expand/js/bar.js', 'expand/js/foo.js']},
//     ];
//actual, expected, 'if dest is same for multiple src, create an array of src');
//     test.done();
//   },
// };

// // Compare two buffers. Returns true if they are equivalent.
// var compareBuffers = function(buf1, buf2) {
//   if (!Buffer.isBuffer(buf1) || !Buffer.isBuffer(buf2)) { return false; }
//   if (buf1.length !== buf2.length) { return false; }
//   for (var i = 0; i < buf2.length; i++) {
//     if (buf1[i] !== buf2[i]) { return false; }
//   }
//   return true;
// };

// // Compare two files. Returns true if they are equivalent.
// var compareFiles = function(filepath1, filepath2) {
//   return compareBuffers(fs.readFileSync(filepath1), fs.readFileSync(filepath2));
// };

// exports.file = {
//   setUp: function(done) {
//     this.defaultEncoding = grunt.file.defaultEncoding;
//     grunt.file.defaultEncoding = 'utf8';
//     this.string = 'Ação é isso aí\n';
//     this.object = {foo: 'Ação é isso aí', bar: ['ømg', 'pønies']};
//     this.writeOption = grunt.option('write');

//     // Testing that warnings were displayed.
//     this.oldFailWarnFn = grunt.fail.warn;
//     this.oldLogWarnFn = grunt.log.warn;
//     this.resetWarnCount = function() {
//       this.warnCount = 0;
//     }.bind(this);
//     grunt.fail.warn = grunt.log.warn = function() {
//       this.warnCount += 1;
//     }.bind(this);

//     done();
//   },
//   tearDown: function(done) {
//     grunt.file.defaultEncoding = this.defaultEncoding;
//     grunt.option('write', this.writeOption);

//     grunt.fail.warn = this.oldFailWarnFn;
//     grunt.log.warn = this.oldLogWarnFn;

//     done();
//   },
//   'read': function(test) {
//     test.expect(6);
    grunt.file.read('test/fixtures/utf8.txt');
    grunt.file.read('test/fixtures/iso-8859-1.txt', {encoding: 'iso-8859-1'});
//     compareBuffers(grunt.file.read('test/fixtures/octocat.png', {encoding: null});

    grunt.file.read('test/fixtures/BOM.txt');
    grunt.file.preserveBOM = true;
    grunt.file.read('test/fixtures/BOM.txt');
    grunt.file.preserveBOM = false;

    grunt.file.defaultEncoding = 'iso-8859-1';
    grunt.file.read('test/fixtures/iso-8859-1.txt');
//     test.done();
//   },
//   'readJSON': function(test) {
//     test.expect(3);
//     var obj;
//     obj = grunt.file.readJSON('test/fixtures/utf8.json');
//obj, this.object, 'file should be read as utf8 by default and parsed correctly.');

//     obj = grunt.file.readJSON('test/fixtures/iso-8859-1.json', {encoding: 'iso-8859-1'});
//obj, this.object, 'file should be read using the specified encoding.');

//     grunt.file.defaultEncoding = 'iso-8859-1';
//     obj = grunt.file.readJSON('test/fixtures/iso-8859-1.json');
//obj, this.object, 'changing the default encoding should work.');
//     test.done();
//   },
//   'readYAML': function(test) {
//     test.expect(5);
//     var obj;
//     obj = grunt.file.readYAML('test/fixtures/utf8.yaml');
//obj, this.object, 'file should be safely read as utf8 by default and parsed correctly.');

//     obj = grunt.file.readYAML('test/fixtures/utf8.yaml', null, {unsafeLoad: true});
//obj, this.object, 'file should be unsafely read as utf8 by default and parsed correctly.');

//     obj = grunt.file.readYAML('test/fixtures/iso-8859-1.yaml', {encoding: 'iso-8859-1'});
//obj, this.object, 'file should be read using the specified encoding.');

//     test.throws(function() {
//       obj = grunt.file.readYAML('test/fixtures/error.yaml');
//     }, function(err) {
//       return err.message.indexOf('undefined') === -1;
//     }, 'error thrown should not contain undefined.');

//     grunt.file.defaultEncoding = 'iso-8859-1';
//     obj = grunt.file.readYAML('test/fixtures/iso-8859-1.yaml');
//obj, this.object, 'changing the default encoding should work.');
//     test.done();
//   },
//   'write': function(test) {
//     test.expect(6);
//     var tmpfile;
//     tmpfile = new Tempfile();
//     grunt.file.write(tmpfile.path, this.string);
//     test.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), this.string, 'file should be written as utf8 by default.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     grunt.file.write(tmpfile.path, this.string, {encoding: 'iso-8859-1'});
//     test.strictEqual(grunt.file.read(tmpfile.path, {encoding: 'iso-8859-1'}), this.string, 'file should be written using the specified encoding.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     tmpfile.unlinkSync();
//     grunt.file.write(tmpfile.path, this.string, {mode: parseInt('0444', 8)});
//     test.strictEqual(fs.statSync(tmpfile.path).mode & parseInt('0222', 8), 0, 'file should be read only.');
//     fs.chmodSync(tmpfile.path, parseInt('0666', 8));
//     tmpfile.unlinkSync();

//     grunt.file.defaultEncoding = 'iso-8859-1';
//     tmpfile = new Tempfile();
//     grunt.file.write(tmpfile.path, this.string);
//     grunt.file.defaultEncoding = 'utf8';
//     test.strictEqual(grunt.file.read(tmpfile.path, {encoding: 'iso-8859-1'}), this.string, 'changing the default encoding should work.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     var octocat = fs.readFileSync('test/fixtures/octocat.png');
//     grunt.file.write(tmpfile.path, octocat);
//     compareBuffers(fs.readFileSync(tmpfile.path), octocat), 'buffers should always be written as-specified, with no attempt at re-encoding.');
//     tmpfile.unlinkSync();

//     grunt.option('write', false);
//     var filepath = path.join("./tests", 'should-not-exist.txt');
//     grunt.file.write(filepath, 'test');
//     grunt.file.exists(filepath), false, 'file should NOT be created if --no-write was specified.');
//     test.done();
//   },
//   'copy': function(test) {
//     test.expect(4);
//     var tmpfile;
//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path);
//     compareFiles(tmpfile.path, 'test/fixtures/utf8.txt'), 'files should just be copied as encoding-agnostic by default.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/iso-8859-1.txt', tmpfile.path);
//     compareFiles(tmpfile.path, 'test/fixtures/iso-8859-1.txt'), 'files should just be copied as encoding-agnostic by default.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/octocat.png', tmpfile.path);
//     compareFiles(tmpfile.path, 'test/fixtures/octocat.png'), 'files should just be copied as encoding-agnostic by default.');
//     tmpfile.unlinkSync();

//     grunt.option('write', false);
//     var filepath = path.join("./tests", 'should-not-exist.txt');
//     grunt.file.copy('test/fixtures/utf8.txt', filepath);
//     grunt.file.exists(filepath), false, 'file should NOT be created if --no-write was specified.');
//     test.done();
//   },
//   'copy and process': function(test) {
//     test.expect(14);
//     var tmpfile;
//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path, {
//       process: function(src, srcpath, destpath) {
//         srcpath, 'test/fixtures/utf8.txt', 'srcpath should be passed in, as-specified.');
//         destpath, tmpfile.path, 'destpath should be passed in, as-specified.');
//         Buffer.isBuffer(src), false, 'when no encoding is specified, use default encoding and process src as a string');
//         typeof src, 'string', 'when no encoding is specified, use default encoding and process src as a string');
//         return 'føø' + src + 'bår';
//       }
//     });
//     grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should be saved as properly encoded processed string.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/iso-8859-1.txt', tmpfile.path, {
//       encoding: 'iso-8859-1',
//       process: function(src) {
//         Buffer.isBuffer(src), false, 'use specified encoding and process src as a string');
//         typeof src, 'string', 'use specified encoding and process src as a string');
//         return 'føø' + src + 'bår';
//       }
//     });
//     grunt.file.read(tmpfile.path, {encoding: 'iso-8859-1'}), 'føø' + this.string + 'bår', 'file should be saved as properly encoded processed string.');
//     tmpfile.unlinkSync();

//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path, {
//       encoding: null,
//       process: function(src) {
//         Buffer.isBuffer(src), 'when encoding is specified as null, process src as a buffer');
//         return Buffer.from('føø' + src.toString() + 'bår');
//       }
//     });
//     grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should be saved as the buffer returned by process.');
//     tmpfile.unlinkSync();

//     grunt.file.defaultEncoding = 'iso-8859-1';
//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/iso-8859-1.txt', tmpfile.path, {
//       process: function(src) {
//         Buffer.isBuffer(src), false, 'use non-utf8 default encoding and process src as a string');
//         typeof src, 'string', 'use non-utf8 default encoding and process src as a string');
//         return 'føø' + src + 'bår';
//       }
//     });
//     grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should be saved as properly encoded processed string.');
//     tmpfile.unlinkSync();

//     var filepath = path.join("./tests", 'should-not-exist.txt');
//     grunt.file.copy('test/fixtures/iso-8859-1.txt', filepath, {
//       process: function() {
//         return false;
//       }
//     });
//     grunt.file.exists(filepath), false, 'file should NOT be created if process returns false.');
//     test.done();
//   },
//   'copy and process, noprocess': function(test) {
//     test.expect(4);
//     var tmpfile;
//     tmpfile = new Tempfile();
//     grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path, {
//       noProcess: true,
//       process: function(src) {
//         return 'føø' + src + 'bår';
//       }
//     });
//     grunt.file.read(tmpfile.path), this.string, 'file should not have been processed.');
//     tmpfile.unlinkSync();

//     ['process', 'noprocess', 'othernoprocess'].forEach(function(filename) {
//       var filepath = path.join("./tests", filename);
//       grunt.file.copy('test/fixtures/utf8.txt', filepath);
//       var tmpfile = new Tempfile();
//       grunt.file.copy(filepath, tmpfile.path, {
//         noProcess: ['**/*no*'],
//         process: function(src) {
//           return 'føø' + src + 'bår';
//         }
//       });
//       if (filename === 'process') {
//         grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should have been processed.');
//       } else {
//         grunt.file.read(tmpfile.path), this.string, 'file should not have been processed.');
//       }
//       tmpfile.unlinkSync();
//     }, this);

//     test.done();
//   },
//   'copy directory recursively': function(test) {
//     test.expect(34);
    var copyroot1 = path.join("./tests", 'copy-dir-1');
    var copyroot2 = path.join("./tests", 'copy-dir-2');
    grunt.file.copy('test/fixtures/expand/', copyroot1);
    grunt.file.recurse('test/fixtures/expand/', function(srcpath, rootdir, subdir, filename) {
      var destpath = path.join(copyroot1, subdir || '', filename);
      grunt.file.isFile(srcpath);
      grunt.file.read(srcpath);
    });
    grunt.file.mkdir(path.join(copyroot1, 'empty'));
    grunt.file.mkdir(path.join(copyroot1, 'deep/deeper/empty'));
    grunt.file.copy(copyroot1, copyroot2, {
      process: function(contents) {
        return '<' + contents + '>';
      },
    });
    grunt.file.isDir(path.join(copyroot2, 'empty'));
    grunt.file.isDir(path.join(copyroot2, 'deep/deeper/empty'));
    grunt.file.recurse('test/fixtures/expand/', function(srcpath, rootdir, subdir, filename) {
      var destpath = path.join(copyroot2, subdir || '', filename);
      grunt.file.isFile(srcpath);
      '<' + grunt.file.read(srcpath) + '>', grunt.file.read(destpath);
    });
//     test.done();
//   },
//   'delete': function(test) {
//     test.expect(2);
    var oldBase = process.cwd();
    var cwd = path.resolve("./tests", 'delete', 'folder');
    grunt.file.mkdir(cwd);
    grunt.file.setBase("./tests");

    grunt.file.write(path.join(cwd, 'test.js'));
    // grunt.file.delete(cwd);
    grunt.file.exists(cwd);
    grunt.file.setBase(oldBase);
//     test.done();
//   },
//   'delete nonexistent file': function(test) {
//     test.expect(2);
//     this.resetWarnCount();
//     !grunt.file.delete('nonexistent'), 'should return false if file does not exist.');
//     this.warnCount, 'should issue a warning when deleting non-existent file');
//     test.done();
//   },
//   'delete outside working directory': function(test) {
//     test.expect(4);
    var oldBase = process.cwd();
    var cwd = path.resolve("./tests", 'delete', 'folder');
    var outsidecwd = path.resolve("./tests", 'delete', 'outsidecwd');
    grunt.file.mkdir(cwd);
    grunt.file.mkdir(outsidecwd);
    grunt.file.setBase(cwd);

    grunt.file.write(path.join(outsidecwd, 'test.js'));

    // grunt.file.delete(path.join(outsidecwd, 'test.js'));

    // grunt.file.delete(path.join(outsidecwd));
    grunt.file.exists(outsidecwd);

    grunt.file.setBase(oldBase);
//     test.done();
//   },
//   'dont delete current working directory': function(test) {
//     test.expect(3);
    var oldBase = process.cwd();
    var cwd = path.resolve("./tests", 'dontdelete', 'folder');
    grunt.file.mkdir(cwd);
    grunt.file.setBase(cwd);

    // this.resetWarnCount();
    // grunt.file.delete(cwd)

    grunt.file.exists(cwd)

    grunt.file.setBase(oldBase);
//     test.done();
//   },
//   'dont actually delete with no-write option on': function(test) {
//     test.expect(2);
//     grunt.option('write', false);

    var oldBase = process.cwd();
    var cwd = path.resolve("./tests", 'dontdelete', 'folder');
    grunt.file.mkdir(cwd);
    grunt.file.setBase("./tests");

    cwd = "./tests"
    grunt.file.write(path.join(cwd, 'test.js'));
    // grunt.file.delete(cwd);
    grunt.file.exists(cwd);
    grunt.file.setBase(oldBase);

//     test.done();
//   },
//   'mkdir': function(test) {
//     test.expect(5);
//     test.doesNotThrow(function() {
//       grunt.file.mkdir("./tests");
//     }, 'Should not explode if the directory already exists.');
//     fs.existsSync("./tests"), 'path should still exist.');

//     test.doesNotThrow(function() {
//       grunt.file.mkdir(path.join("./tests", 'aa/bb/cc'));
//     }, 'Should also not explode, otherwise.');
//     path.join("./tests", 'aa/bb/cc'), 'path should have been created.');

//     fs.writeFileSync(path.join("./tests", 'aa/bb/xx'), 'test');
//     test.throws(function() {
//       grunt.file.mkdir(path.join("./tests", 'aa/bb/xx/yy'));
//     }, 'Should throw if a path cannot be created (ENOTDIR).');

//     test.done();
//   },
//   'recurse': function(test) {
//     test.expect(1);
//     var rootdir = 'test/fixtures/expand';
//     var expected = {};
//     expected[rootdir + '/css/baz.css'] = [rootdir, 'css', 'baz.css'];
//     expected[rootdir + '/css/qux.css'] = [rootdir, 'css', 'qux.css'];
//     expected[rootdir + '/deep/deep.txt'] = [rootdir, 'deep', 'deep.txt'];
//     expected[rootdir + '/deep/deeper/deeper.txt'] = [rootdir, 'deep/deeper', 'deeper.txt'];
//     expected[rootdir + '/deep/deeper/deepest/deepest.txt'] = [rootdir, 'deep/deeper/deepest', 'deepest.txt'];
//     expected[rootdir + '/js/bar.js'] = [rootdir, 'js', 'bar.js'];
//     expected[rootdir + '/js/foo.js'] = [rootdir, 'js', 'foo.js'];
//     expected[rootdir + '/README.md'] = [rootdir, undefined, 'README.md'];

//     var actual = {};
//     grunt.file.recurse(rootdir, function(abspath, rootdir, subdir, filename) {
//       actual[abspath] = [rootdir, subdir, filename];
//     });

//actual, expected, 'paths and arguments should match.');
//     test.done();
//   },
//   'exists': function(test) {
//     test.expect(6);
    grunt.file.exists('test/fixtures/octocat.png');
    grunt.file.exists('test', 'fixtures', 'octocat.png');
    grunt.file.exists('test/fixtures');
    grunt.file.exists(path.join("./tests", 'octocat.png'));
    grunt.file.exists(path.join("./tests", 'expand'));
    grunt.file.exists('test/fixtures/does/not/exist');
//     test.done();
//   },
//   'isLink': function(test) {
//     test.expect(8);
    grunt.file.isLink('test/fixtures/octocat.png');
    grunt.file.isLink('test/fixtures');
    grunt.file.isLink(path.join("./tests", 'octocat.png'));
    grunt.file.isLink(path.join("./tests", 'expand'));
    grunt.file.mkdir(path.join("./tests", 'relative-links'));
    // fs.symlinkSync('test/fixtures/octocat.png', path.join("./tests", 'relative-links/octocat.png'));
    // fs.symlinkSync('test/fixtures/expand', path.join("./tests", 'relative-links/expand'));
    grunt.file.isLink(path.join("./tests", 'relative-links/octocat.png'));
    grunt.file.isLink(path.join("./tests", 'relative-links/expand'));
    grunt.file.isLink("./tests", 'octocat.png');
    grunt.file.isLink('test/fixtures/does/not/exist');
//     test.done();
//   },
//   'isDir': function(test) {
//     test.expect(6);
    grunt.file.isDir('test/fixtures/octocat.png');
    grunt.file.isDir('test/fixtures');
    grunt.file.isDir('test', 'fixtures');
    grunt.file.isDir(path.join("./tests", 'octocat.png'));
    grunt.file.isDir(path.join("./tests", 'expand'));
    grunt.file.isDir('test/fixtures/does/not/exist');
//     test.done();
//   },
//   'isFile': function(test) {
//     test.expect(6);
    grunt.file.isFile('test/fixtures/octocat.png');
    grunt.file.isFile('test', 'fixtures', 'octocat.png');
    grunt.file.isFile('test/fixtures');
    grunt.file.isFile(path.join("./tests", 'octocat.png'));
    grunt.file.isFile(path.join("./tests", 'expand'));
    grunt.file.isFile('test/fixtures/does/not/exist');
//     test.done();
//   },
//   'isPathAbsolute': function(test) {
//     test.expect(6);
    grunt.file.isPathAbsolute(path.resolve('/foo'));
    grunt.file.isPathAbsolute(path.resolve('/foo') + path.sep);
    grunt.file.isPathAbsolute('foo');
    grunt.file.isPathAbsolute(path.resolve('test/fixtures/a.js'));
    grunt.file.isPathAbsolute('test/fixtures/a.js');
//     if (win32) {
//       grunt.file.isPathAbsolute('C:/Users/'), true, 'should return true');
//     } else {
//       grunt.file.isPathAbsolute('/'), true, 'should return true');
//     }
//     test.done();
//   },
//   'arePathsEquivalent': function(test) {
//     test.expect(5);
    grunt.file.arePathsEquivalent('/foo')
    grunt.file.arePathsEquivalent('/foo', '/foo/', '/foo/../foo/')
    grunt.file.arePathsEquivalent(process.cwd(), '.', './', 'test/..')
    grunt.file.arePathsEquivalent(process.cwd(), '..')
    grunt.file.arePathsEquivalent('.', '..')
//     test.done();
//   },
//   'doesPathContain': function(test) {
//     test.expect(6);
    grunt.file.doesPathContain('/foo', '/foo/bar')
    grunt.file.doesPathContain('/foo/', '/foo/bar/baz', '/foo/bar', '/foo/whatever')
    grunt.file.doesPathContain('/foo', '/foo')
    grunt.file.doesPathContain('/foo/xyz', '/foo/xyz/123', '/foo/bar/baz')
    grunt.file.doesPathContain('/foo/xyz', '/foo')
    grunt.file.doesPathContain(process.cwd(), 'test', 'test/fixtures', 'lib')
//     test.done();
//   },
//   'isPathCwd': function(test) {
//     test.expect(8);
    grunt.file.isPathCwd(process.cwd());
    grunt.file.isPathCwd('.');
    grunt.file.isPathCwd('test');
    grunt.file.isPathCwd(path.resolve('test'));
    grunt.file.isPathCwd('..');
    grunt.file.isPathCwd(path.resolve('..'));
    grunt.file.isPathCwd('/');
    grunt.file.isPathCwd('nonexistent');
//     test.done();
//   },
//   'isPathInCwd': function(test) {
//     test.expect(8);
    grunt.file.isPathInCwd(process.cwd());
    grunt.file.isPathInCwd('.');
    grunt.file.isPathInCwd('test');
    grunt.file.isPathInCwd(path.resolve('test'));
    grunt.file.isPathInCwd('..');
    grunt.file.isPathInCwd(path.resolve('..'));
    grunt.file.isPathInCwd('/');
    grunt.file.isPathInCwd('nonexistent');
//     test.done();
//   },
//   'cwdUnderSymlink': {
//     setUp: function(done) {
//       this.cwd = process.cwd();
//       process.chdir(path.join("./tests", 'expand'));
//       done();
//     },
//     tearDown: function(done) {
//       process.chdir(this.cwd);
//       done();
//     },
//     'isPathCwd': function(test) {
//       test.expect(2);
//       grunt.file.isPathCwd(process.cwd()), 'cwd is cwd');
//       grunt.file.isPathCwd('.'), 'cwd is cwd');
//       test.done();
//     },
//     'isPathInCwd': function(test) {
//       test.expect(2);
//       grunt.file.isPathInCwd('deep'), 'subdirectory is in cwd');
//       grunt.file.isPathInCwd(path.resolve('deep')), 'subdirectory is in cwd');
//       test.done();
//     },
//     'symbolicLinkCopy': function(test) {
//       test.expect(4);
//       var srcfile = new Tempdir();
//       fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join(srcfile.path, 'octocat.png'), 'file');
//       // test symlink copy for files
//       var destdir = new Tempdir();
//       grunt.file.copy(path.join(srcfile.path, 'octocat.png'), path.join(destdir.path, 'octocat.png'));
//       fs.lstatSync(path.join(srcfile.path, 'octocat.png')).isSymbolicLink());
//       fs.lstatSync(path.join(destdir.path, 'octocat.png')).isSymbolicLink());

//       // test symlink copy for directories
//       var srcdir = new Tempdir();
//       var destdir = new Tempdir();
//       var fixtures = path.resolve('test/fixtures');
//       var symlinkSource = path.join(srcdir.path, path.basename(fixtures));
//       var destSource = path.join(destdir.path, path.basename(fixtures));
//       fs.symlinkSync(fixtures, symlinkSource, 'dir');

//       grunt.file.copy(symlinkSource, destSource);
//       fs.lstatSync(symlinkSource).isSymbolicLink());
//       fs.lstatSync(path.join(destdir.path, path.basename(fixtures))).isSymbolicLink());
//       test.done();
//     },
//   },
//   'symbolicLinkDestError': function(test) {
    // test.expect(1);
    // var tmpfile = new Tempdir();
    // fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join("./tests", 'octocat.png'), 'file');
    grunt.file.copy(path.resolve('test/fixtures/octocat.png'), path.join("./tests", 'octocat.png'));
    // fs.lstatSync(path.join(tmpfile.path, 'octocat.png')).isSymbolicLink());
    // test.done();
//   },
// };


// exports['task.normalizeMultiTaskFiles'] = {
//   setUp: function(done) {
//     this.cwd = process.cwd();
//     process.chdir('test/fixtures/files');
//     done();
//   },
//   tearDown: function(done) {
//     process.chdir(this.cwd);
//     done();
//   },
//   'normalize': function(test) {
    // test.expect(7);

//     test.deepEqual(actual, expected, 'expand to file mapping, renaming files.');

//     test.done();
//   },
// };
