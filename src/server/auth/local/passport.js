'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userDAL = require('../../data-access/user.js');
var config = require('../../config/environment');

var exceptionMessages = require('../../common/exceptionMessages.js');

module.exports.setup = function () {

  passport.use(new LocalStrategy({

      usernameField: 'userName',
      passwordField: 'password'
    },
    function (userName, password, done) {

      console.log('Local strategy handler executing');

      userDAL.getByUserNamePassword(userName, password)
        .then(function (user) {
          if(user) {
            console.log('user found');
          } else {
            console.log('user not found for: ' + userName, password);
            var error = exceptionMessages.createError('username_or_password_not_found');
            error.statusCode = 404;
            throw error;
          }
          return user;
        })
        .then(function (user) {
            return done(null, user);
          },
          function (err) {
            console.log(err);
            done(err);
          });
    }
  ));
};
