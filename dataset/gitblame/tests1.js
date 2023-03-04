var gitblame = require('gitblame');
gitblame("gitblame", function(err, lines){
  // do something with these lines
});

gitblame("gitblame/README.md", function(err, lines){
    // do something with these lines
  });