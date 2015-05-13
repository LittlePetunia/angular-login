// routes.api.users.js
/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var authDAL = require('../common/auth.js');
var routeUtils = require('./routeUtils.js');
var log = require('../common/myLog.js').create('/server/common/auth');

router.post('/authenticate', function (req, res, next) {

  log.info('/authenticate', 'called with', req.body);

  var userInfo = req.body;

  authDAL.authenticate(userInfo.userName, userInfo.password)
    .then(
      function (data) {
        res.status(200)
          .json({
            token: data
          });
      },
      routeUtils.onError(500, res));
});

module.exports = router;
