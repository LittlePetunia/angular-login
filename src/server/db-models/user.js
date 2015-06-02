'use strict';

var exceptionMessages = require('../common/exceptionMessages.js');
var mongoose = require('mongoose');

// var uniqueValidator = require('mongoose-unique-validator');
// var _ = require('underscore');

var providers = ['google'];

if(!mongoose.models.User) {

  var UserSchema = new mongoose.Schema({
    userName: {
      type: String,
      trim: true,
      minlength: 8,
      maxlength: 100
    },

    password: {
      type: String,
      minlength: 8,
      maxlength: 100
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
        // match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    },

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true
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

  // // virtuals
  // we don't get a username from google (so far...)
  // UserSchema
  //   .virtual('displayUserName')
  //   .get(function () {
  //     return this.userName || this.google.name;
  //   });

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

  UserSchema
    .pre('save', function (next) {
      // user must have username/password/email if not from a provider

      //console.log('pre-validating user');
      if(!this.provider) {
        var error;
        if(!this.userName) {
          error = exceptionMessages.createError('validation_failure', 'UserName is required');
        }
        if(!this.password) {
          error = exceptionMessages.createError('validation_failure', 'Password is required');
        }
        if(!this.email) {
          error = exceptionMessages.createError('validation_failure', 'Email is required');
        }

        if(error) {
          error.statusCode = 422; //unporcessable entity
          //console.log('exiting pre-validate with error found');
          return next(error);
        }
      }

      //console.log('exiting pre-validate with no error found');

      next();

    });

  mongoose.model('User', UserSchema);
}

function validateUnique(path, pathDesc) {
  UserSchema
    .path(path)
    .validate(function (value, respond) {
      //console.log('validating unique ' + path + ': ' + value);
      if(value) {

        var whereClause = {};
        whereClause[path] = value;

        var self = this;
        this.constructor.findOne(whereClause, function (err, data) {
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
