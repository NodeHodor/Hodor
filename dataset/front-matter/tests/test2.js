var fm = require('front-matter')
var fs = require('fs')
var path = require('path')


fs.readFile(
  path.resolve(__dirname, './examples/dashes-seperator.md'),
  'utf8',
  function (err, data) {

    var content = fm(data)

    content.attributes
    content.attributes.title
    content.attributes.tags.length

    content.body
    content.body.match("don't break")
    content.body.match('---')
    content.body.match("Also this shouldn't be a problem")

    content.bodyBegin

    content.frontmatter
    content.frontmatter.match('title: Three dashes marks the spot')
    content.frontmatter.match('expaned-description: with some --- crazy stuff in it')

  })

// test('fm(string) - parse yaml delinetead by `= yaml =`', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/yaml-seperator.md'),
    'utf8',
    function (err, data) {
    //   t.error(err, 'read(...) should not error')

      var content = fm(data)
      var meta = content.attributes
      var body = content.body

      meta.title
      meta.description
    })
// })

// test('fm(string) - parse yaml ended by `...`', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/dots-ending.md'),
    'utf8',
    function (err, data) {

      var content = fm(data)
      var meta = content.attributes
      var body = content.body

      meta.title
      meta.description
    })
// })

// test('fm(string) - string missing front-matter', function (t) {
  var content = fm('No front matter here')

  console.log(content.body, 'No front matter here')
// })

// test('fm(string) - string missing body', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/missing-body.md'),
    'utf8',
    function (err, data) {
      var content = fm(data)

      content.attributes.title
      content.body
      content.bodyBegin
    })
// })

// test('fm(string) - insecure yaml', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/unsafe.md'),
    'utf8',
    function (err, data) {
    })
// })

// test('fm(string) - wrapped test in yaml', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/wrapped-text.md'),
    'utf8',
    function (err, data) {

      var content = fm(data)
      var folded = [
        'There once was a man from Darjeeling',
        'Who got on a bus bound for Ealing',
        '    It said on the door',
        '    "Please don\'t spit on the floor"',
        'So he carefully spat on the ceiling\n'
      ].join('\n')

      content.attributes['folded-text']
    })
// })

// test('fm(string) - strings with byte order mark', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/bom.md'),
    'utf8',
    function (err, data) {

      var content = fm(data)

      content.attributes.title
    })
// })

// test('fm(string) - no front matter, markdown with hr', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/no-front-matter.md'),
    'utf8',
    function (err, data) {
        var content = fm(data)
        content.body
        content.bodyBegin
    })
// })

// test('fm(string, true) - complex and unsafe yaml', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/complex-yaml.md'),
    'utf8',
    function (err, data) {
      var content = fm(data, { allowUnsafe: true })
      content.attributes
      content.attributes.title
      content.attributes.contact
      content.attributes.match.toString()
    })
// })

// test('fm.test(string) - yaml seperator', function (t) {
  fs.readFile(
    path.resolve(__dirname, './examples/yaml-seperator.md'),
    'utf8',
    function (err, data) {
      fm.test(data)
    })
// })

// test('fm.test(string) - dashes seperator', function (t) {
  fs.readFile(
    path.resolve(__dirname, '../examples/dashes-seperator.md'),
    'utf8',
    function (err, data) {
      fm.test(data)
    })
// })

// test('fm.test(string) - no front-matter', function (t) {
  fm.test('no front matter here')
// })

// test('Supports live updating', function (t) {
  var seperator = '---'
  var string = ''
  for (var i = 0; i < seperator.length; i++) {
    string += seperator[i]

    try {
      fm(string)
    } catch (e) {
      t.error(e)
    }
  }

  string += '\n'
  string += 'foo: bar'

  var content = fm(string)


  string += '\n---\n'
  content = fm(string)
// })
