var fs = require('fs')
  , fm = require('front-matter')

fs.readFile('/home/nodejs/dataset/front-matter/example.md', 'utf8', function(err, data){
  if (err) throw err
  var content = fm(data)
  var x = content.attributes + 'Hello';
  console.log(content.body);
})
