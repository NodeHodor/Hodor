const gulp = require('gulp')
const log = require('fancy-log')
const tape = require('../')

gulp.task('test', function () {
  return gulp
    .src('fixtures/test.js')
    .pipe(
      tape({
        bail: true,
        nyc: true
      })
    )
    .on('error', function (error) {
      log(error.message)
      process.exit(1)
    })
})
