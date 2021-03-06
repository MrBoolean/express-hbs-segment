var gulp = require('gulp');
var gds = require('gulp-dev-server');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var codeclimate = require('gulp-codeclimate-reporter');

gulp.task('dev', function dev() {
  gds.task({
    restart: ['lib/**/*.js', 'index.js', 'example/**/*'],
    notify: ['lib/**/*.js', 'index.js', 'example/**/*'],
    server: {
      verbose: true,
      environment: 'development',
      script: { path: 'example/index.js' }
    }
  });

  gulp.watch(['lib/**/*.js', 'index.js', 'test/**/*.js'], ['test', 'lint']);
});

gulp.task('test.instrument', function instrument() {
  return gulp
    .src(['index.js', 'lib/**/*.js'])
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
  ;
});

gulp.task('test', ['test.instrument'], function test() {
  return gulp
    .src(['test/**/*.test.js'])
    .pipe(mocha({
      require: ['./test/bootstrap']
    }))
    .pipe(istanbul.writeReports({
      dir: './dist/test-report'
    }))
  ;
});

gulp.task('lint', function lint() {
  return gulp
    .src(['index.js', 'lib/**/*.js', 'test/**/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
  ;
});

gulp.task('codeclimate', function sendToCodeclimate() {
  return gulp
    .src(['dist/test-report/lcov.info'], { read: false })
    .pipe(codeclimate({
      token: 'ace5a0799686f8aee5116930af919c78bd594c2d9db11e6695f74851f7bc77e0'
    }))
  ;
});

gulp.task('default', ['lint', 'test']);
