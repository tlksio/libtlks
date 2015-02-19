var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('jshint', function () {
    gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['jshint'], function () {
});
