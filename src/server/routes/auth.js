// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
// var authDAL = require('../common/auth.js');
var userDAL = require('../data-access/user.js');
var routeUtils = require('./routeUtils.js');
var log = require('../common/myLog.js').create('/server/routes/auth');
var auth = require('../auth/auth.service');
var exceptionMessages = require('../common/exceptionMessages');

module.exports = function (passport) {
  router.post('/auth/local', function (req, res, next) {

    // log.info('/auth/local', 'called with', req.body);
    // return res.status(200).json({});

    userDAL.getByUserNamePassword(req.body.userName, req.body.password)
      .then(function (user) {
        if(user) {
          console.log('user found');
          req.user = user;
          //res.cookie('token', 'testvalue');
          //return res.status(200).json({});
          return auth.setTokenCookie(req, res);
          // next(null, user);
          // console.log('redirecting');

          // res.redirect('/');
        } else {
          console.log('user not found for: ' + req.body.userName, req.body.password);
          var error = exceptionMessages.createError('username_or_password_not_found');
          error.statusCode = 404;
          throw error;
        }
      })
      .then(null,
        function (err) {
          console.log(err);
          next(err);
        });

    // authDAL.authenticate(userInfo.userName, userInfo.password)
    //   .then(
    //     function (data) {
    //       // // res.status(200)
    //       // //   .json({
    //       // //     token: data
    //       // //   });
    //       //
    //       // auth.setTokenCookie
    //       //return data;
    //       res.user = data;
    //     },
    //     routeUtils.onError(500, res));
  });

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
