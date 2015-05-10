'use strict';

var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
// var idvalidator = require('mongoose-id-validator');
var _ = require('underscore');
var log = require('./myLog.js').create('/server/common/session');
var SessionModel = require('../db-models/session.js');

function get(id) {
  return SessionModel.findById(id).exec();
}

function create(session) {

  log.info('create', 'creating session for: ', session);

  var copy = _.clone(session);
  delete copy._id;

  var s = new SessionModel(copy);
  log.info('create', 'saving session for: ', s);

  return s.save()
    .then(function (data) {
        log.info('create', 'success', data);
        return data;
      },
      function (err) {
        log.error('create', 'error', err);
        throw err;
      });
}

function update(session) {
  // console.log('update() session._id ' + session._id);
  if (!session._id) {
    var promise = new mongoose.Promise();
    var error = new Error();
    error.message = 'update operation requires session object to have _id value';
    error.statusCode = 422; //422 Unprocessable Entity
    promise.reject(error);
    return promise;
  }

  return get(session._id)
    .then(function (data) {
      if (!data) {
        var error = new Error();
        error.message = 'Session not found with id ' + session._id;
        error.statusCode = 404; // not found
        throw error;
      } else {
        data.createdDateTime = session.createdDateTime;
        data.expireDateTime = session.expireDateTime;
        return data.save();
      }
    })
    .then(function (data) {
        log.info('update', 'success', data);
        return data;
      },
      function (err) {
        log.error('update', 'error', err);
        throw err;
      });
}

function deleteOld(olderThanThisDateTime) {
  return SessionModel.find({
      'expireDateTime': {
        $lt: olderThanThisDateTime
      }
    })
    .remove().exec();
}

module.exports = {
  Model: SessionModel,
  get: get,
  create: create,
  update: update,
  deleteOld: deleteOld
};
