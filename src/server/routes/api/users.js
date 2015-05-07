// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../../db-models/user.js');

// GET
router.get('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;

  User.getByUserId(userId)
    .then(onSuccess(200, res), onError(500, res));
});

// POST
router.post('/users/', function (req, res, next) {

  if (!req.body) {
    return res.status(400) // 400: bad request
      .json('body must contain a user object json');
  }

  User.create(req.body) // 201: created
    .then(onSuccess(201, res), onError(500, res));
});

// DELETE
router.delete('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;

  User.deleteById(userId)
    .then(onSuccess(200, res), onError(500, res));
});

// PUT
router.put('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;
  var user = req.body;

  if (user._id == null) {
    user._id = userId;
  } else if (user._id.toString() !== userId.toString()) {
    return res.status(400) // 400: bad request
      .json('id of object does not match id in path.' + ' object _id: ' + user._id + ' path id: ' + userId);
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
    console.log('failure: ' + err);

    code = err.statusCode || code || 500;
    var msg = err.message || err;

    return res.status(code)
      .json({
        message: msg
      });
  };
}

module.exports = router;
