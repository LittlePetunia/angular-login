/* File: gulpfile.js */

/* jshint strict: false */

//TODO: update this to use a json file with config info like
// John Papa's example in his module project
// And while your at it have it minify to a build directory

// packages
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  karma = require('karma').server,
  protractor = require('gulp-protractor').protractor,
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  mocha = require('gulp-spawn-mocha'),
  runSequence = require('run-sequence');

// jshint
gulp.task('jshint', function () {
  return gulp.src('src/client/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint-watch', function () {
  return gulp.watch(['src/client/**/*.js'], ['jshint']);
});

gulp.task('karma', function (done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('protractor', function () {
  return gulp.src(['src/client/test/e2e/*test-e2e.js'])
    .pipe(protractor({
      'configFile': 'protractor.conf.js'
    }))
    .on('error', function (e) {
      gutil.log(e.message);
    });
});

gulp.task('mocha', function () {
  return gulp
    .src(['src/server/test/e2e/*.*Spec.js'])
    .pipe(mocha({
      istanbul: true
    }));
});

gulp.task('protractor-watch', function () {
  gulp.watch(['src/client/**/*.*', './protractor.conf.js'], ['protractor']);
});

gulp.task('mocha-watch', function () {
  gulp.watch(['src/server/**/*.js'], ['mocha']);
});

gulp.task('karma-watch', function () {
  return gulp.watch(['src/client/**/*.js'], ['karma']);
});

// TODO: need to make sure the node server is running before karma
gulp.task('test', function (cb) {
  runSequence('protractor', 'karma', 'mocha', cb);
});

gulp.task('browser-sync', function () {
  browserSync({
    proxy: 'localhost:' + 3000,
    port: 3000,
    files: ['src/client' + '/**/*.*'],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    //logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0 //ms
  });
});

gulp.task('default', function (cb) {
  runSequence('browser-sync', 'jshint-watch', 'karma-watch', 'mocha-watch', cb);
});
