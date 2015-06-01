// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../data-access/user.js');
var routeUtils = require('../routeUtils.js');
var exceptionMessages = require('../../common/exceptionMessages.js');
var auth = require('../../auth/auth.service');
var path = require('path');

// GET All
router.get('/users', function (req, res, next) {

  User.get({})
    .then(routeUtils.onSuccess(200, res),
      routeUtils.onError(500, res));
});

// GET me
router.get('/users/me', auth.isAuthenticated(), function (req, res, next) {

  // express-jwt decodes token and sets it to request.user
  console.log('getting user: ' + req.user._id);
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

  // console.log('put called');

  if(user._id == null) {
    user._id = userId;
  } else if(user._id.toString() !== userId.toString()) {

    var debugInfo = 'object _id: ' + user._id + ' path id: ' + userId;
    var error = exceptionMessages.createError('path_id_differs_from_object_id', null, debugInfo);
    // var fn = routeUtils.onError(422, res);
    // return fn(error);

    return routeUtils.onError(422, res)(error);
  }

  // console.log('updating a user');
  User.update(user)
    .then(routeUtils.onSuccess(200, res),
      routeUtils.onError(500, res));
  return;

});

module.exports = router;
