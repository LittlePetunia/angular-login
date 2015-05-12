'use strict';

var userDAL = require('./user.js');
var sessionDAL = require('./session.js');
var utils = require('./utils.js');
var log = require('./myLog.js').create('/server/common/auth');
var jwt = require('jsonwebtoken');
var Q = require('q');

var publicKey = 'mySecretKeyForNow';
// var publicKey = fs.readFileSync('/pat/to/public.pub');

// authenticates and creates session
function authenticate(userName, password) {

  // console.log('authenticate');

  return log.promise('authenticate',
    userDAL.getByUserNamePassword(userName, password)
    .then(function (user) {
      if (!user) {
        log.info('authenticate', 'no match found for user/pass: ' + userName + ', ' + password);

        var error = new Error();
        error.message = 'User not found with specified id and password';
        error.statusCode = 404; // not found
        throw error;
      }

      log.info('authenticate', 'ready to create session object for', user);

      // TODO:  make a constant for this session duration.
      var durationMinutes = 30;
      var expireDateTime = utils.addMinutes(Date.now(), durationMinutes);
      // We are sending the profile inside the token
      var token = jwt.sign(user, publicKey, {
        expiresInMinutes: durationMinutes
      });
      // do i really have to return a promise or can I return just data?
      var deferred = Q.defer();
      deferred.resolve(token);
      return deferred.promise;
      // return log.promise('authenticate',
      //   // sessionDAL.create({
      //   //   userId: data._id,
      //   //   expireDateTime: expireDateTime
      //   // })
      //
      //
      // );
    }));
}

module.exports = {
  authenticate: authenticate
};
