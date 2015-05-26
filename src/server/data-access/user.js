'use strict';
// TODO: move this into 'data-access' dir

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('underscore');

var mongooseUtils = require('../common/mongooseUtils.js');
var UserModel = require('../db-models/user.js');
var log = require('../common/myLog.js').create('/server/db-access/user');
var exceptionMessages = require('../common/exceptionMessages.js');

var userFields = 'userId userName email firstName lastName';

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
    .select(userFields)
    .exec()
    .then(function (dbUser) {
      if(!dbUser) {
        // var error = new Error();
        // error.message = 'User not found with id ' + userId;
        // error.statusCode = 404; // not found
        var error = exceptionMessages.createError('user_not_found_for_id', null, 'id: ' + userId);
        error.statusCode = 404;
        throw error;
      }
      return dbUser;
    }));
}

function getByUserNamePassword(userName, password) {

  // return log.promise('getByUserNamePassword',
  //   UserModel.findOne({
  //     userName: userName,
  //     password: password
  //   })
  //   .select(userFields)
  //   .exec());

  return log.promise('getByUserNamePassword',
    UserModel.findOne({
      userName: userName,
      password: password
    })
    .select(userFields)
    .exec());

}

function create(user) {

  var copy = _.clone(user);
  delete copy._id;

  var newUser = new UserModel(copy);
  // return newUser.save();
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
  return log.promise('userSave',
    user.save()
  ).then(function (data) {
      console.log('userSave succeeded');
      return data;
    },
    function (err) {
      // console.log('error after trying to save user');
      // console.log(err);
      if(err.message === 'User validation failed') {

        var emailUnique = err.errors.email && err.errors.email.message.search('must be unique') !== -1;
        var userNameUnique = err.errors.userName && err.errors.userName.message.search('must be unique') !== -1;

        // console.log('email ' + emailUnique + ' user ' + userNameUnique);
        var customError;
        if(emailUnique && userNameUnique) {
          customError = exceptionMessages.createError('email_and_username_not_available');
          customError.statusCode = 422; //422 Unprocessable Entity

          // console.log('emailUnique && userNameUnique');
          // console.log(err);
        } else if(emailUnique) {
          customError = exceptionMessages.createError('email_not_available');
          customError.statusCode = 422; //422 Unprocessable Entity
        } else if(userNameUnique) {
          customError = exceptionMessages.createError('username_not_available');
          customError.statusCode = 422; //422 Unprocessable Entity
        } else {
          customError = exceptionMessages.createError('unhandled_validation_failure');
          customError.statusCode = 422; //422 Unprocessable Entity
        }

        console.log('throwing custom error');
        console.log(customError);
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

    // error = new Error();
    // error.message = 'update operation requires user object to have _id';
    // error.statusCode = 422; //422 Unprocessable Entity

    var error = exceptionMessages.createError('cannot_update_object_with_null_id', 'User update');
    error.statusCode = 422; //422 Unprocessable Entity
    promise.reject(error);
    return promise;
  }

  return log.promise('update',
    getById(user._id)
    .then(function (dbUser) {
      // is there a better way to copy without copying any _id and  __v property?
      mongooseUtils.copyFieldsToModel(user, dbUser);
      // return dbUser.save();
      return saveUser(dbUser);
    })
    // .then(function (data) {
    //     console.log('update user succeeded');
    //     return data;
    //   },
    //   function (err) {
    //     console.log('error after trying to save user');
    //     console.log(err);
    //     if(err.message === 'User validation failed') {
    //
    //       var emailUnique = err.errors.email && err.errors.email.message.search('must be unique') !== -1;
    //       var userNameUnique = err.errors.userName && err.errors.userName.message.search('must be unique') !== -1;
    //
    //       var error;
    //       if(emailUnique && userNameUnique) {
    //         error = exceptionMessages.createError('email_and_username_not_available');
    //         error.statusCode = 422; //422 Unprocessable Entity
    //       } else if(emailUnique) {
    //         error = exceptionMessages.createError('email_not_available');
    //         error.statusCode = 422; //422 Unprocessable Entity
    //       } else if(userNameUnique) {
    //         error = exceptionMessages.createError('username_not_available');
    //         error.statusCode = 422; //422 Unprocessable Entity
    //       } else {
    //         error = exceptionMessages.createError('unhandled_validation_failure');
    //         error.statusCode = 422; //422 Unprocessable Entity
    //       }
    //
    //       throw err;
    //     } else {
    //       // not a validation error!
    //       return err;
    //     }
    //   }
    // )
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
