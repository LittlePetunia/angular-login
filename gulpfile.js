/* File: gulpfile.js */

/* jshint strict: false */

//TODO: update this to use a json file with config info like
// John Papa's example in his module project
// And while your at it have it minify to a build directory

var paths = {
  css: './src/client/app/content/*.css',
  img: './src/client/app/content/img/*.*',
  html: './src/client/app/**/*.html',
  indexHtml: 'src/client/app/index.html',
  js: './src/client/app/**/*.js',
  fileNames: {
    templateCache: 'template.js'
  },
  // server: {
  //
  // },
  build: './dist/'
};

// packages
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  karma = require('karma').server,
  protractor = require('gulp-protractor').protractor,
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  mocha = require('gulp-spawn-mocha'),
  runSequence = require('run-sequence'),
  del = require('del'),
  angularTemplatecache = require('gulp-angular-templatecache'),
  inject = require('gulp-inject');

gulp.task('css', ['clean'], function () {
  // copy html from angular app to dist/public
  return gulp
    .src(paths.css)
    .pipe(gulp.dest(paths.build + 'content/'));

});
gulp.task('js', ['clean'], function () {
  // copy html from angular app to dist/public
  return gulp
    .src(paths.js)
    .pipe(gulp.dest(paths.build));

});
gulp.task('img', ['clean'], function () {
  // copy html from angular app to dist/public
  return gulp
    .src(paths.img)
    .pipe(gulp.dest(paths.build + 'content/img/'));

});

gulp.task('inject', ['templateCache'], function () {
  // copy html from angular app to dist/public

  return gulp
    .src(paths.indexHtml)
    .pipe(inject(gulp.src(paths.fileNames.templateCache, {
      cwd: paths.build
    })))
    // .pipe(inject(gulp.src(paths.fileNames.templateCache)))
    .pipe(gulp.dest(paths.build));
});

gulp.task('templateCache', ['clean'], function () {
  // log('Creating an AngularJS $templateCache');

  return gulp
    .src(['src/client/app/**/*.html', '!' + paths.indexHtml])
    // .pipe(plug.bytediff.start())
    // .pipe(plug.minifyHtml({
    //     empty: true
    // }))
    // .pipe(plug.bytediff.stop(bytediffFormatter))
    .pipe(angularTemplatecache(paths.fileNames.templateCache, {
      module: 'app',
      standalone: false,
      root: 'app/'
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('clean', function (cb) {
  return del(['dist'],
    cb);
});

gulp.task('build', ['templateCache', 'css', 'img', 'js', 'inject']);

// jshint
gulp.task('jshint', function () {
  return gulp.src('src/client/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
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

// build
// copy all html,js,css

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
