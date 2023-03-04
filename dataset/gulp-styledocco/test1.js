var styledocco = require('gulp-styledocco');
var a = styledocco({
  out: 'docs',
  name: 'My Project',
  'no-minify': true
});
a._transform({path: 'mysite.css', isNull: () => { return false}, isStream: () => { return false}}, "", ()=>{})
a._flush(()=>{})
