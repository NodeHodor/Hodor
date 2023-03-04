/*
combined files : 

page/a/mod/b
page/a/aa

*/
KISSY.add('page/a/mod/b',function(){
  return 'hello b'
});

KISSY.add('page/a/aa',function(){
  return 'hello a';
}, {
  requires: ['./mod/b']
})

