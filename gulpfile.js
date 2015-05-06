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
  browserSync = require('browser-sync');


var filePaths = {
  appJS: 'public/ang/*.js',
  //unitTestJS: 'public/ang/test/unit/*test-unit.js',
  e2eTestJS: 'src/client/test/e2e/*test-e2e.js'
};

// jshint
gulp.task('jshint-run', function() {
  return gulp.src('public/ang/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// gulp.task('jshint-watch', function(){
//   gulp.watch(filePaths.appJS, ['jshint-run']);
// });


// karma
gulp.task('karma-run', ['jshint-run'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('protractor-run', ['jshint-run'], function() {
  return gulp.src([filePaths.e2eTestJS])
    .pipe(protractor({
      'configFile': 'protractor.conf.js'
    }))
    // .on('error', function(e) { throw e });
    .on('error', function(e) {
      gutil.log(e.message);
    });

});

gulp.task('protractor-watch', function() {
  gulp.watch(['src/client/**/*.js',
    'src/client/**/*.html',
    'src/client/**/*.css',
    './protractor.conf.js'
  ], ['protractor-run', 'karma-run', 'jshint-run']);
});

gulp.task('browser-sync', function() {
  startBrowserSync();
  // browserSync.init({
  //   server:{
  //     baseDir:'./',
  //     proxy: 'localhost:3000',
  //     files: 'src/client/**/*.*'
  //   }
  // });
});

// // create a default task and just log a message
// gulp.task('running-log', function() {
//   gutil.log('Gulp is running!');
// });




gulp.task('default', [
  'browser-sync',
  'jshint-run',
  'karma-run',
  'protractor-run',

  //'jshint-watch',
  'protractor-watch'
]);



function startBrowserSync() {
  // if(!env.browserSync || browserSync.active) {
  //     return;
  // }

  // log('Starting BrowserSync on port ' + port);
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
    reloadDelay: 0000
  });
}
