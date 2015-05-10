'use strict';

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('underscore');

if (!mongoose.models.User) {

  var userSchema = new mongoose.Schema({
    userName: {
      type: String,
      unique: true,
      required: '{PATH} is required',
      minlength: 8,
      maxlength: 100
    },
    password: {
      type: String,
      required: '{PATH} is required',
      minlength: 8,
      maxlength: 100
    },
    email: {
      type: String,
      required: '{PATH} is required',
      match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      unique: true
    },
    firstName: {
      type: String,
      required: '{PATH} is required',
      minlength: 1,
      maxlength: 100
    },
    lastName: {
      type: String,
      required: '{PATH} is required',
      minlength: 1,
      maxlength: 100
    },
    createdDateTime: {
      type: Date,
      default: Date.now,
      required: '{PATH} is required'
    }
  });

  userSchema.plugin(uniqueValidator, {
    message: 'Error, {PATH} {VALUE} must be unique.'
  });

  mongoose.model('User', userSchema);

}

module.exports = mongoose.model('User');
