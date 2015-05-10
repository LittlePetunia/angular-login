'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// configure dev logger
require('./common/myLog.js').config({
  logFlag: true
});

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'dev';

var dbName = 'login';
if (env === 'test') {
  // use test db
  dbName = 'login_test';
}

mongoose.connect('mongodb://localhost/' + dbName);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/../client/content/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// routes setup
require('./routes/index.js')(app);

// in dev environment we serve the page from /src/client
// and resources from /bower_components
app.use('/', express.static('./src/client'));
app.use('/', express.static('./'));

// error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    msg: err
  });
});

console.log('About to crank up node');
console.log('PORT: ' + port);
console.log('NODE_ENV: ' + env);
console.log('DB: ' + dbName);

module.exports = app;
