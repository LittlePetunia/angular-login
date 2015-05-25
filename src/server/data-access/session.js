'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var log = require('../common/myLog.js').create('/server/data-access/session');
var SessionModel = require('../db-models/session.js');

function get(id) {
  return log.promise('get',
    SessionModel.findById(id).exec());
}

function create(session) {

  log.info('create', 'creating session for: ', session);

  var copy = _.clone(session);
  delete copy._id;

  var s = new SessionModel(copy);
  log.info('create', 'saving session for: ', s);

  return log.promise('create',
    s.save());
}

function update(session) {
  // console.log('update() session._id ' + session._id);
  if(!session._id) {
    var promise = new mongoose.Promise();
    var error = new Error();
    error.message = 'update operation requires session object to have _id value';
    error.statusCode = 422; //422 Unprocessable Entity
    promise.reject(error);
    return promise;
  }

  return log.promise('update',
    get(session._id)
    .then(function (data) {
      if(!data) {
        var error = new Error();
        error.message = 'Session not found with id ' + session._id;
        error.statusCode = 404; // not found
        throw error;
      } else {
        data.createdDateTime = session.createdDateTime;
        data.expireDateTime = session.expireDateTime;
        return data.save();
      }
    }));
}

function deleteOld(olderThanThisDateTime) {
  return log.promise('deleteOld',
    SessionModel.find({
      'expireDateTime': {
        $lt: olderThanThisDateTime
      }
    })
    .remove().exec());
}

module.exports = {
  Model: SessionModel,
  get: get,
  create: create,
  update: update,
  deleteOld: deleteOld
};