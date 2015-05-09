'use strict';

module.exports = (function () {

  var mongoose = require('mongoose');
  // var uniqueValidator = require('mongoose-unique-validator');

  var ObjectId = mongoose.Schema.Types.ObjectId;

  // unit tests use this require multiple times so can have this model already defined
  // which gives an error
  // TODO: a better way might be to delete the model before each test so it will be re-created.
  // I have seen it done like this before but I want to use existing schema.

  // beforeEach(function(done) {
  //     if (mongoose.connection.models['User']) {
  //         delete mongoose.connection.models['User'];
  //     }
  //
  //     User = mongoose.model('User', mongoose.Schema({
  //        ...
  //     });
  //
  //     User.remove({}).exec().then(function () {
  //         done();
  //     });
  // });

  var SessionModel;

  if (mongoose.models.Session) {
    SessionModel = mongoose.model('Session');
  } else {
    var sessionSchema = new mongoose.Schema({

      userId: {
        type: ObjectId,
        ref: 'User',
        required: '{PATH} is required'
      },
      createdDateTime: {
        type: Date,
        required: '{PATH} is required',
        default: Date.now
      },
      expireDateTime: {
        type: Date,
        required: '{PATH} is required'
      }

    });

    // sessionSchema.plugin(uniqueValidator, {
    //   message: 'Error, {PATH} {VALUE} must be unique.'
    // });

    SessionModel = mongoose.model('Session', sessionSchema);
  }

  function get(id) {
    return SessionModel.findById(id).exec();
  }

  function create(session) {
    var s = new SessionModel(session);
    return s.save();
  }

  function update(session) {
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

  return {
    Model: SessionModel,
    get: get,
    create: create,
    update: update,
    deleteOld: deleteOld
  };
}());
