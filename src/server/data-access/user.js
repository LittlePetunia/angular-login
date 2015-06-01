'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('underscore');

var mongooseUtils = require('../common/mongooseUtils.js');
var UserModel = require('../db-models/user.js');
var log = require('../common/myLog.js').create('/server/db-access/user');
var exceptionMessages = require('../common/exceptionMessages.js');

var userFields = 'userId userName email firstName lastName fullName';

function get(condition) {
  return UserModel
    .find(condition)
    .select(userFields).exec();
}

function getById(userId) {
  return log.promise('getById',
    UserModel.findOne({
      _id: userId
    })
    //.select(userFields)
    .exec());
}

function getByUserNamePassword(userName, password) {

  return log.promise('getByUserNamePassword',
    UserModel.findOne({
      userName: userName,
      password: password
    })
    //.select(userFields)
    .exec());

}

function create(user) {

  var copy = _.clone(user);
  delete copy._id;

  var newUser = new UserModel(copy);
  return saveUser(newUser);
}

function deleteById(userId) {

  return log.promise('deleteById',
    UserModel.findOneAndRemove({
      _id: userId
    }).exec()
    .then(function (data) {
      if(!data) {
        var error = exceptionMessages.createError('user_not_found_for_id', null, 'id: ' + userId);
        error.statusCode = 404;
        throw error;
      }
      return data;
    }));
}

function saveUser(user) {
  return log.promise('saveUser',
    user.save()
  ).then(function (data) {
      // console.log('userSave succeeded');
      return data;
    },
    function (err) {
      if(err.message === 'User validation failed') {

        var emailUnique = err.errors.email && err.errors.email.message.search('must be unique') !== -1;
        var userNameUnique = err.errors.userName && err.errors.userName.message.search('must be unique') !== -1;

        // console.log(err);
        var customError;
        if(emailUnique && userNameUnique) {
          customError = exceptionMessages.createError('email_and_username_not_available');
          customError.statusCode = 422; //422 Unprocessable Entity
        } else if(emailUnique) {
          customError = exceptionMessages.createError('email_not_available');
          customError.statusCode = 422; //422 Unprocessable Entity
        } else if(userNameUnique) {
          customError = exceptionMessages.createError('username_not_available');
          customError.statusCode = 422; //422 Unprocessable Entity
        } else {

          var errMsg = Object.keys(err.errors).map(function (key) {
            return err.errors[key].message.replace(/Path /g, '').replace(/`/g, '');
          }).join('. ');

          // console.log(errMsg);
          customError = exceptionMessages.createError('validation_failure', errMsg);
          customError.statusCode = 422; //422 Unprocessable Entity
        }

        // console.log('throwing custom error');
        // console.log(customError);
        throw customError;
      } else {
        // not a validation error!
        return err;
      }
    }
  );
}

function update(user) {

  if(!user._id) {
    var promise = new mongoose.Promise();
    var error = exceptionMessages.createError('cannot_update_object_with_null_id', 'User update');
    error.statusCode = 422; //422 Unprocessable Entity
    promise.reject(error);
    return promise;
  }

  return log.promise('update',
    getById(user._id)
    .then(function (dbUser) {
      // only these fields should be updated
      ['userName', 'email', 'firstName', 'lastName'].forEach(function (val) {
        dbUser[val] = user[val];
      });
      return saveUser(dbUser);
    })
  );
}

module.exports = {
  Model: UserModel,
  get: get,
  getById: getById,
  getByUserNamePassword: getByUserNamePassword,
  create: create,
  deleteById: deleteById,
  update: update
};
