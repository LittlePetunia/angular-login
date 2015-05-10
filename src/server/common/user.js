'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('underscore');

var mongooseUtils = require('../common/mongooseUtils.js');
var UserModel = require('../db-models/user.js');
var log = require('./myLog.js').create('/server/common/user');


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
    })
    .then(function (data) {
        log.success('create', 'success', data);
        return data;
      },
      function (err) {
        log.error('create', 'error', err);
        throw err;
      });;
}

function getByUserNamePassword(userName, password) {
  return UserModel.findOne({
      userName: userName,
      password: password
    })
    .exec();
}

function create(user) {

  var copy = _.clone(user);
  delete copy._id;

  var newUser = new UserModel(copy);
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

module.exports = {
  Model: UserModel,
  get: get,
  getById: getById,
  getByUserNamePassword: getByUserNamePassword,
  create: create,
  deleteById: deleteById,
  update: update
};
