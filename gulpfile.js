var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function() {
    return gulp.src(['node_modules', 'coverage'], {
            read: false
        })
        .pipe(clean());
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

gulp.task('default', ['jshint'], function() {});
