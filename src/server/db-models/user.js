'use strict';

var mongoose = require('mongoose');

// var uniqueValidator = require('mongoose-unique-validator');
// var _ = require('underscore');

var providers = ['google'];

if(!mongoose.models.User) {

  var UserSchema = new mongoose.Schema({
    userName: {
      type: String,
      trim: true
    },
    password: {
      type: String
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
        // match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    },
    firstName: {
      type: String,
      trim: true
        // required: '{PATH} is required',
        // minlength: 1,
        // maxlength: 100
    },
    lastName: {
      type: String,
      trim: true
        // required: '{PATH} is required',
        // minlength: 1,
        // maxlength: 100
    },

    provider: {
      type: String
    },
    google: {},

    createdDateTime: {
      type: Date,
      default: Date.now
    }
  });

  UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
  });
  UserSchema.set('toObject', {
    getters: true,
    virtuals: true
  });

  // virtuals
  UserSchema
    .virtual('displayUserName')
    .get(function () {
      return this.userName || this.google.name;
    });

  // virtuals
  UserSchema
    .virtual('fullName')
    .get(function () {
      return this.firstName + ' ' + this.lastName;
    });

  // validation
  // userName length
  UserSchema
    .path('userName')
    .validate(function (value) {
        if(value && value.length < 8) {
          return false;
        }
        return true;
      },
      'Username must be at least 8 characters');

  validateUnique('email');
  validateUnique('userName');

  mongoose.model('User', UserSchema);

}

function validateUnique(path, pathDesc) {
  UserSchema
    .path(path)
    .validate(function (value, respond) {
      if(value) {
        var self = this;
        this.constructor.findOne({
          path: value
        }, function (err, data) {
          if(err) {
            throw err;
          }

          if(data && data.id !== self.id) {
            respond(false);
          }
          respond(true);
        });
      }
    }, 'The ' + (pathDesc || path) + ' is already in use');
}

module.exports = mongoose.model('User');
