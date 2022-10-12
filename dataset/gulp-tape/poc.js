var root = require("gulp-tape");
var gulp = require("gulp");
var options = {
  name: "& touch JHU.txt"
}
gulp.src("./gulp-tape.js")
  .pipe(root(options));
