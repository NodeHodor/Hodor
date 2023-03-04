const fix = require("eslint-fixer");
 
fix("./my-file.js")
  .then(result => doSomething())
  .catch(err => console.error(err));
