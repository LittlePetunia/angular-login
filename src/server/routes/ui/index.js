// routes.ui.index.js

var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  'use strict';

  var appHtmlPath = path.join(__dirname, '../../../client/app/index.html');
  res.sendFile(appHtmlPath);

});

module.exports = router;
