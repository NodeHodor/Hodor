var herokuEnv = require('heroku-env');
herokuEnv('my-heroku-app-name', function(err, env) {
  //env is an object in the format: 
  /*
  {
    HEROKU_POSTGRESQL_COPPER_URL: "<huge url here>,
    PGDATABASE: 'bla bla blah',
    ....
  }

  */
});
