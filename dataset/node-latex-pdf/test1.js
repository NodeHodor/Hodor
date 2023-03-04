const selflatex = require('node-latex-pdf');

selflatex(__dirname + '/src/document.tex', __dirname + '/dest/', (err,msg) => {
    if(err)
      console.log(`Error, ${msg}`);
    else
      console.log(`Success! ${msg}`);
});
