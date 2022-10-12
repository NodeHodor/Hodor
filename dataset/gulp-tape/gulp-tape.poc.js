var root = require("gulp-tape");
var gulp = require("gulp");
var options = {
  name: "& touch JHU.txt"
}
r = root(options);
console.log(r);
gulp.src("./gulp-tape.js")
  .pipe(r);
