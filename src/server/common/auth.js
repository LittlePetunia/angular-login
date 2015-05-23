'use strict';

var userDAL = require('../data-access/user.js');
var sessionDAL = require('../data-access/session.js');
var utils = require('./utils.js');
var log = require('./myLog.js').create('/server/common/auth');
var jwt = require('jsonwebtoken');
var Q = require('q');

var publicKey = 'mySecretKeyForNow';
// var publicKey = fs.readFileSync('/pat/to/public.pub');

// authenticates and creates session
function authenticate(userName, password) {

  // console.log('authenticate()');
  // if (!userName || !password) {
  //   console.log('invalid username/password: ');
  //   console.log(userName);
  //   console.log(password);
  //   log.info('authenticate', 'no match found for user/pass: ' + userName + ', ' + password);
  // }

  return log.promise('authenticate',
    userDAL.getByUserNamePassword(userName, password)
    .then(function (user) {
      if(!user) {
        log.info('authenticate', 'no match found for user/pass: ' + userName + ', ' + password);

        var error = new Error();
        error.message = 'Invalid username or password';
        error.statusCode = 404; // not found
        throw error;
      }

      log.info('authenticate', 'ready to create session object for', user);

      // TODO:  make a constant for this session duration.
      var durationMinutes = 30;
      var options = {
        expiresInMinutes: durationMinutes
          // other options: audience, issuer, subject
      };

      var token = jwt.sign(user, publicKey, options);

      return token;
    }));
}

module.exports = {
  authenticate: authenticate
};
