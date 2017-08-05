'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    bs = require('browser-sync');

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('css'))
        .pipe(bs.reload({ stream: true }));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('js'))
        .pipe(bs.reload({ stream: true }))
});

gulp.task('browser-sync', ['sass', 'scripts'], function() {
  bs.init({
    server: {
      baseDir: "./"
    }
  })
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('*.html').on('change', bs.reload);
});
