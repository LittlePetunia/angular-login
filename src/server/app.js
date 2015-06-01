'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var expressJwt = require('express-jwt');
// var jwt = require('jsonwebtoken');
var passport = require('passport');

var config = require('./config/environment');

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'dev';
var logLevel = process.env.NODE_LOG_LEVEL;

// configure dev logger
if(logLevel === 'none') {
  require('./common/myLog.js').config({
    logFlag: false,
    logTypesAllowed: []
  });
} else {
  require('./common/myLog.js').config({
    logFlag: true,
    logTypesAllowed: ['Success', 'Error', 'Info']
  });
}

var connectionString;
var dbOptions = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

// TODO: create module for mongoose setup
var dbName = 'login';

if(env === 'test') {
  dbName = 'login_test';
  connectionString = 'mongodb://localhost/' + dbName;
} else if(env === 'pro') {
  var mongodbUri = process.env.MONGOLAB_URI; //'mongodb://user:pass@host:port/db';
  console.log('MONGO_URI: ' + process.env.MONGOLAB_URI);

  var mongoUriUtil = require('mongodb-uri');
  connectionString = mongoUriUtil.formatMongoose(mongodbUri);
  console.log('Mongo connection string: ' + connectionString);

} else {
  connectionString = 'mongodb://localhost/' + dbName;
}

mongoose.connect(connectionString);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

var app = express();

app.use(logger('dev'));

// protect /api routes with JWT (not sure if this needs to be first or is better after logger)
// var publicKey = 'mySecretKeyForNow';
// TODO: use public key for secret
// var publicKey = fs.readFileSync('/pat/to/public.pub');

// so we can use this in other places
// app.set('jwtTokenSecret', publicKey);
//
// app.use('/api', expressJwt({
//     secret: config.secrets.tokenSecret
//   })
//   .unless({
//     method: 'POST',
//     path: '/api/users'
//   }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(passport.initialize());

require('./auth/google/passport').setup();

// routes setup
require('./routes/index.js')(app, passport);

// static dir
if(env === 'build') {
  app.use('/', express.static('./dist'));
} else if(env === 'pro') {
  app.use('/', express.static('./dist'));
} else {
  app.use('/', express.static('./src/client')); // angular
  app.use('/', express.static('./')); // bower_components
}

// error handling
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (err, req, res, next) {

  console.log('error handler route called');
  // res.status(err.status || 500);
  // res.json({
  //   msg: err
  // });

  var code = err.statusCode || 500;
  var name = err.name || 'Unspecified Error';
  var msg;

  if(err.exceptionInfo) {
    msg = err.exceptionInfo.message;
  } else {
    // unhandled error. We won't pass the message but we should log it.
    msg = 'Error occurred';
    // TODO: implement logging system for saving to file and add errors from here
    console.error(err);
  }

  return res.status(code)
    .json({
      name: name,
      message: msg
    });
});

console.log('About to crank up node');
console.log('PORT: ' + port);
console.log('NODE_ENV: ' + env);
console.log('DB: ' + dbName);
console.log('NODE_LOG_LEVEL: ' + logLevel);

module.exports = app;
