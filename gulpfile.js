var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require("browserify");

gulp.task('default', function() {
  browserify('./example.js')
    .bundle()
    .pipe(source("compiled.js"))
    .pipe(gulp.dest("compiled/"));
});
