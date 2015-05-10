'use strict';

var userDAL = require('./user.js');
var sessionDAL = require('./session.js');
var utils = require('./utils.js');
var log = require('./myLog.js').create('/server/common/auth');

// authenticates and creates session
function authenticate(userName, password) {

  console.log('authenticate');

  return userDAL.getByUserNamePassword(userName, password)
    .then(function (data) {
      if (!data) {
        log.info('authenticate', 'no match found for user/pass: ' + userName + ', ' + password);

        var error = new Error();
        error.message = 'User not found with specified id and password';
        error.statusCode = 404; // not found
        throw error;
      }

      log.info('authenticate', 'ready to create session object for', data);

      // TODO:  make a constant for this session duration.
      var durationMinutes = 30;
      var expireDateTime = utils.addMinutes(Date.now(), durationMinutes);

      return sessionDAL.create({
          userId: data._id,
          expireDateTime: expireDateTime
        })
        .then(function (data) {
            log.info('update', 'success', data);
            return data;
          },
          function (err) {
            log.error('update', 'error', err);
            throw err;
          });
    });
}

module.exports = {
  authenticate: authenticate
};
