// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
// var authDAL = require('../common/auth.js');
// var userDAL = require('../data-access/user.js');
// var routeUtils = require('./routeUtils.js');
// var log = require('../common/myLog.js').create('/server/routes/auth');
var auth = require('../auth/auth.service');
var exceptionMessages = require('../common/exceptionMessages');

var passport = require('passport');

module.exports = function () {

  router.post('/auth/local', passport.authenticate('local', {
    failureRedirect: '/register',
    session: false
  }), auth.setTokenCookie);

  router.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/register',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    session: false
  }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/register',
    session: false
  }), auth.setTokenCookie);

  return router;
};
