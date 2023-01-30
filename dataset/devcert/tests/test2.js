const fs = require('fs');
const Express = require('express');
const app = new Express();
https
  .createServer({
    key: fs.readFileSync('./certs/tls.key'),
    cert: fs.readFileSync('./certs/tls.cert')
  }, app)
  .listen(3000);
