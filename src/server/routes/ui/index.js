// routes.ui.index.js

var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  'use strict';

  var appHtmlPath;
  if(process.env.NODE_ENV === 'build') {
    appHtmlPath = path.join(__dirname, '../../../../dist/index.html');
  } else {
    appHtmlPath = path.join(__dirname, '../../../client/index.html');
  }
  // var appHtmlPath = path.join(__dirname, '../../../../dist/index.html');
  res.sendFile(appHtmlPath);

});

module.exports = router;
