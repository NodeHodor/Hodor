var styledocco = require('gulp-styledocco');

gulp.task('styledocco', function () {
  gulp.src('src/**/*.css')
    .pipe(styledocco({
      out: 'docs',
      name: 'My Project',
      'no-minify': true
    }));
});
