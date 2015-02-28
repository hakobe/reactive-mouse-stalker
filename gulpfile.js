var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require("browserify");

gulp.task('default', function() {
  browserify("./main.js") .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("compiled/"));
});
