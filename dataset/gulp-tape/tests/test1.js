const gulp = require('gulp')
const tape = require('gulp-tape')
 
gulp.task('test', function () {
  return gulp.src('test/*.js')
    .pipe(tape({
      bail: true
    }))
})
