var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require("browserify");

gulp.task('default', function() {
  browserify()
    .require('./reactive-mouse-stalker.js', { expose: 'reactive-mouse-stalker' })
    .bundle()
    .pipe(source("compiled.js"))
    .pipe(gulp.dest("compiled/"));
});
