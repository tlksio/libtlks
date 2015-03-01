var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');

gulp.task('clean', function() {
    return gulp.src(['node_modules', 'coverage'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('jshint', function() {
    return gulp.src(['./lib/**/*.js', 'index.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['jshint'], function() {});
