const gulp = require('gulp')
// const log = require('fancy-log')
const tape = require('gulp-tape')

gulp.task('test', function () {
  gulp
    .src('fixtures/test.js')
    .pipe(
      tape({
        bail: true,
        nyc: true,
        require: []
      })
    )
    .on('error', function (error) {
      // log(error.message)
      // process.exit(1)
    })
})


var a = tape({
  bail: true,
  nyc: true,
  require: []
})

a._flush(()=>{})
a._transform({isNull: () => {return false}, isStream: () => {return false}}, "", ()=>{})