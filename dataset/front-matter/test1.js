var fs = require('fs')
  , fm = require('front-matter')
 
fs.readFile('./example.md', 'utf8', function(err, data){
  if (err) throw err
 
  var content = fm(data)
 
  console.log(content)
})
