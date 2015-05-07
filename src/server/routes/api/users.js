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
    var errors = JSON.stringify(err.errors || []);

    // console.log('log code: ' + code);
    // console.log('log name: ' + name);
    // console.log('log msg: ' + msg);
    // console.log('log errors: ' + errors);

    // console.log('log status: ' + code);
    return res.status(code)
      .json({
        name: name,
        message: msg,
        errors: errors
      });
  };
}

module.exports = router;
