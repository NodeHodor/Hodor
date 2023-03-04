const GOOGLE = require('google-cloudstorage-commands')
var fs = require('fs');
var path = require('path');
const BUCKET_NAME = 'samrad-deuxtube/'
const BUCKET = `gs://${BUCKET_NAME}`

GOOGLE.upload("some/directory", "gs://soe_bucket/")
  .then(() => {})
  .catch(err => {
    console.log(err);
  })
