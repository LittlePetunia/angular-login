// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../../db-models/user.js');
var path = require('path');

// GET All
router.get('/users', function (req, res, next) {

  User.get({})
    .then(onSuccess(200, res), onError(500, res));
});
// Get One
router.get('/users/:userId', function (req, res, next) {

  // console.log('getting a user: ' + req.params.userId);
  var userId = req.params.userId;

  User.getById(userId)
    .then(onSuccess(200, res), onError(500, res));
});

// POST
router.post('/users', function (req, res, next) {

  // console.log('req.baseUrl: ' + req.baseUrl);
  User.create(req.body) // 201: created
    .then(function (data) {
        res
          .location(path.join(req.baseUrl, 'users', data._id.toString()))
          .status(201)
          .json(data);
      },
      onError(500, res));
});

// DELETE
router.delete('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;

  User.deleteById(userId) //204 No Content
    .then(onSuccess(204, res), onError(500, res));
});

// PUT
router.put('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;
  var user = req.body;

  if (user._id == null) {
    user._id = userId;
  } else if (user._id.toString() !== userId.toString()) {
    return res.status(422) //422 Unprocessable Entity
      .json({
        message: 'id of object does not match id in path.' + ' object _id: ' + user._id + ' path id: ' + userId
      });
  }

  User.update(user)
    .then(onSuccess(200, res), onError(500, res));
});

function onSuccess(code, res) {
  return function (data) {
    return res.status(code).json(data);
  };
}

function onError(code, res) {
  return function (err) {

    code = err.statusCode || code || 500;
    var name = err.name || 'Unspecified Error';
    var msg = err.message || err;
    // var errors = JSON.stringify(err.errors || []);
    console.log('route error object: ' + JSON.stringify(err || ''));

    console.log('route errors: ' + JSON.stringify(err.errors || []));

    // TODO: move error message normalization to the DAL.
    // decode ValidationError and MongoError errors.

    var errors;
    if (err.errors && typeof (err.errors) === 'object' && Object.keys(err.errors).length > 0) {
      if (typeof (err.errors) === 'object') {
        // console.log('errors is object');
        if (Object.keys(err.errors).length > 0) {
          // console.log('errors has keys');
          errors = [];

          var e = err.errors;

          for (var k in e) {
            if (e.hasOwnProperty(k) && e[k].message) {
              console.log('errors adding message: ' + e[k].message);

              errors.push(e[k].message);
            }
          }

        }
      } else if (typeof (err.errors) === 'string') {
        errors = err.errors;
      } else if (Array.isArray(err.errors)) {
        throw new Error('unhandled error errors list type');
      }
    }

    // console.log('log code: ' + code);
    // console.log('log name: ' + name);
    // console.log('log msg: ' + msg);
    // console.log('log errors: ' + errors);

    // console.log('log status: ' + code);
    // console.log('returning json');
    return res.status(code)
      .json({
        name: name,
        message: msg,
        errors: errors
      });
  };
}

module.exports = router;
