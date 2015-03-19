var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var coveralls = require('gulp-coveralls');
var del = require('del');

gulp.task('clean', function() {
    del(['node_modules', 'coverage'], function(err, delfiles) {
        return err
    });
});

gulp.task('dist', function() {
    return gulp.src(['./index.js', './lib/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('libtlks.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(rename('libtlks.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
    return gulp.src(['./lib/**/*.js', 'index.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('coveralls', function() {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['jshint'], function() {});
