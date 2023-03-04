const asciinema = require('extra-asciinema');
// import * as asciinema from 'extra-asciinema';

asciinema.recSync('saved.cast', {input: 'example.js'});
// runs example.js interactively in node.js, saves 'saved.cast'
asciinema.rec('saved.cast', {input: 'example.js'});


asciinema.retimeSync('saved.cast', {inputDelay: 2});
// 'saved.cast' is updated
asciinema.retime('saved.cast', {inputDelay: 2});

asciinema.uploadSync('saved.cast');
// asciicast URL
asciinema.upload('saved.cast');

asciinema.cat('tmp');
asciinema.catSync('tmp');