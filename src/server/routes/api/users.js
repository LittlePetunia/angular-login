// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../data-access/user.js');
var routeUtils = require('../routeUtils.js');

var path = require('path');

// GET All
router.get('/users', function (req, res, next) {

  User.get({})
    .then(routeUtils.onSuccess(200, res),
      routeUtils.onError(500, res));
});

// GET me
router.get('/users/me', function (req, res, next) {

  // express-jwt decodes token and sets it to request.user
  User.getById(req.user._id)
    .then(routeUtils.onSuccess(200, res),
      routeUtils.onError(500, res));
});
// Get One
router.get('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;

  User.getById(userId)
    .then(routeUtils.onSuccess(200, res),
      routeUtils.onError(500, res));
});

// POST
router.post('/users', function (req, res, next) {

  User.create(req.body) // 201: created
    .then(function (data) {
        res
          .location(path.join(req.baseUrl, 'users', data._id.toString()))
          .status(201)
          .json(data);
      },
      routeUtils.onError(500, res));
});

// DELETE
router.delete('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;

  User.deleteById(userId) //204 No Content
    .then(routeUtils.onSuccess(204, res),
      routeUtils.onError(500, res));
});

// PUT
router.put('/users/:userId', function (req, res, next) {

  var userId = req.params.userId;
  var user = req.body;

  if(user._id == null) {
    user._id = userId;
  } else if(user._id.toString() !== userId.toString()) {
    return res.status(422) //422 Unprocessable Entity
      .json({
        message: 'id of object does not match id in path.' + ' object _id: ' + user._id + ' path id: ' + userId
      });
  }

  User.update(user)
    .then(routeUtils.onSuccess(200, res),
      routeUtils.onError(500, res));
});

module.exports = router;
