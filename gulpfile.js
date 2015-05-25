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
  runSequence = require('run-sequence'),
  del = require('del'),
  angularTemplatecache = require('gulp-angular-templatecache'),
  inject = require('gulp-inject');

var paths = {
  css: './src/client/content/*.css',
  img: './src/client/content/img/*.*',
  html: './src/client/app/**/*.html',
  indexHtml: './src/client/index.html',
  js: './src/client/app/**/*.js',
  bower: './bower_components/**',
  build: './dist/'
};

var fileNames = {
  htmlTemplates: 'templates.js'
};

gulp.task('clean', function (cb) {
  return del(['dist'],
    cb);
});
gulp.task('copy-css', ['clean'], function () {
  return gulp
    .src(paths.css)
    .pipe(gulp.dest(paths.build + 'content/'));
});
gulp.task('copy-js', ['clean', 'jshint'], function () {
  return gulp
    .src(paths.js)
    .pipe(gulp.dest(paths.build + 'app/'));

});
gulp.task('copy-img', ['clean'], function () {
  return gulp
    .src(paths.img)
    .pipe(gulp.dest(paths.build + 'content/img/'));
});

gulp.task('copy-html', ['clean'], function () {
  // NOTE: we don't need this html since we are already loading it in the templates.js file
  //       but for now I will load it for debugging purpose.
  return gulp
    .src(['src/client/**/*.html', '!' + paths.indexHtml])
    .pipe(gulp.dest(paths.build));
});

gulp.task('htmlTemplates', ['clean'], function () {
  return gulp
    .src(['src/client/app/**/*.html', '!' + paths.indexHtml])
    .pipe(angularTemplatecache(fileNames.htmlTemplates, {
      module: 'app',
      standalone: false,
      root: 'app/'
    }))
    .pipe(gulp.dest(paths.build + 'app/'));
});
gulp.task('inject-angular-templates', ['htmlTemplates'], function () {
  // this copies index.html to dist dir and injects template.js ref to it.
  return gulp
    .src(paths.indexHtml)
    .pipe(inject(gulp.src('app/' + fileNames.htmlTemplates, {
      cwd: paths.build
    })))
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-bower-components', ['clean'], function () {
  // TODO: this can be way more selective and just copy the
  //       specific files we use instead of the entire directory of min/zip/map... files.
  gulp.src(paths.bower)
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('build', ['htmlTemplates', 'copy-html', 'copy-css', 'copy-img', 'copy-js', 'inject-angular-templates',
  'copy-bower-components'
]);
// gulp.task('build', ['copy-html', 'copy-css', 'copy-img', 'copy-js',
//   'copy-bower-components'
// ]);

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
