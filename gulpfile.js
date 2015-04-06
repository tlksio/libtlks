var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var coveralls = require('gulp-coveralls');
var del = require('del');

gulp.task('clean', function() {
    "use strict";
    del(['node_modules', 'coverage'], function(err, delfiles) {
        return err;
    });
});

gulp.task('dist', function() {
    "use strict";
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
    "use strict";
    return gulp.src(['./test/**/*.js', './lib/**/*.js', 'index.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('coveralls', function() {
    "use strict";
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['jshint'], function() {});
