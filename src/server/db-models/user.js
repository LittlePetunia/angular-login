module.exports = (function () {
  'use strict';

  var mongoose = require('mongoose');
  var uniqueValidator = require('mongoose-unique-validator');

  var mongooseUtils = require('../common/mongooseUtils.js');
  var _ = require('underscore');
  // var Promise = require('mpromise');

  // unit tests use this require multiple times so can have this model already defined
  // which gives an error
  var UserModel;

  if (mongoose.models.User) {
    // console.log('Using existing todo model');
    UserModel = mongoose.model('User');
  } else {

    // console.log('Creating new todo model');
    var userSchema = new mongoose.Schema({
      userName: {
        type: String,
        unique: true,
        required: '{PATH} is required',
        minlength: 8,
        maxlength: 100
      },
      password: {
        type: String,
        required: '{PATH} is required',
        minlength: 8,
        maxlength: 100
      },
      email: {
        type: String,
        required: '{PATH} is required',
        match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        unique: true
      },
      firstName: {
        type: String,
        required: '{PATH} is required',
        minlength: 1,
        maxlength: 100
      },
      lastName: {
        type: String,
        required: '{PATH} is required',
        minlength: 1,
        maxlength: 100
      },
      createdDateTime: {
        type: Date,
        default: Date.now,
        required: '{PATH} is required'
      }
    });

    userSchema.plugin(uniqueValidator, {
      message: 'Error, {PATH} {VALUE} must be unique.'
    });

    UserModel = mongoose.model('User', userSchema);

  }

  function get(condition) {

    return UserModel.find(condition).exec();
  }

  function getById(userId) {
    return UserModel.findOne({
        _id: userId
      })
      .exec()
      .then(function (dbUser) {
        if (!dbUser) {
          var error = new Error();
          error.message = 'User not found with id ' + userId;
          error.statusCode = 404; // not found
          throw error;
        }
        return dbUser;
      });
  }

  function create(user) {

    var copy = _.clone(user);
    delete copy._id;

    var newUser = new UserModel(user);
    return newUser.save();
  }

  function deleteById(userId) {

    return UserModel.findOneAndRemove({
        _id: userId
      }).exec()
      .then(function (data) {
        if (!data) {
          var error = new Error();
          error.message = 'User not found with id ' + userId;
          error.statusCode = 404; // not found
          throw error;
        }
        return data;
      });
  }

  function update(user) {

    var error;

    if (!user._id) {
      var promise = new mongoose.Promise();

      error = new Error();
      error.message = 'update operation requires user object to have _id';
      error.statusCode = 422; //422 Unprocessable Entity
      promise.reject(error);
      return promise;
    }

    return getById(user._id)
      .then(function (dbUser) {
        // is there a better way to copy without copying any _id and  __v property?
        mongooseUtils.copyFieldsToModel(user, dbUser);
        return dbUser.save();
      });
  }

  return {
    Model: UserModel,
    get: get,
    getById: getById,
    create: create,
    deleteById: deleteById,
    update: update
  };
}());
