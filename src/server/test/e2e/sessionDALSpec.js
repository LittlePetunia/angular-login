// src/server/test/e2e/todoSpec.js
'use strict';

/* global before */
/* global after */
/*jshint -W079 */
var expect = require('chai').expect;

var mongoose = require('mongoose');
var sessionDAL = require('../../db-models/session.js');
var userDAL = require('../../db-models/user.js');
var utils = require('../../common/utils.js');
var testUtils = require('../../common/testUtils.js');
var dbUri = 'mongodb://localhost/login_test';

describe.only('Session DAL', function () {

  var session;
  var user;

  // open db connection if needed (if mocha stays active between runs then connection still exists)
  before(function (done) {
    testUtils.connect(mongoose, dbUri, done);
  });

  // clear users
  before(function (done) {
    userDAL.Model.remove({}).exec()
      .then(function () {
        done();
      }, done);
  });
  // create user
  before(function (done) {
    user = {
      userName: 'testUser',
      password: 'hellokitty',
      email: 'testuser@mail.com',
      firstName: 'test',
      lastName: 'user'
    };

    userDAL.create(user)
      .then(function (data) {
        expect(data).to.have.property('_id');
        user._id = data._id;
      })
      .then(function () {
        done();
      }, done);
  });

  // clear sessions
  beforeEach(function (done) {
    sessionDAL.Model.remove({}).exec()
      .then(function () {
        done();
      }, done);
  });

  after(function (done) {
    testUtils.closeConnection(mongoose, done);
  });

  it('should create a new session', function (done) {
    var newSession = {
      userId: user._id,
      expireDateTime: utils.addMinutes(Date.now(), 30)
    };

    sessionDAL.create(newSession)
      .then(function (data) {
        return sessionDAL.Model.find().exec();
      })
      .then(function (data) {
        expect(data).to.not.be.null;
        expect(data).to.have.length(1);
      })
      .then(function () {
        done();
      }, done);
  });

  describe('Existing session', function () {
    // create session
    var newSession;
    beforeEach(function (done) {

      newSession = {
        userId: user._id,
        expireDateTime: utils.addMinutes(Date.now(), 30)
      };

      sessionDAL.create(newSession)
        .then(function (data) {
          newSession = data;
        })
        .then(function () {
          done();
        }, done);
    });

    describe('get', function () {
      it('should get a session', function (done) {

        sessionDAL.get(newSession._id)
          .then(function (data) {
            expect(data).to.not.be.null;
            expect(data._id.equals(newSession._id)).to.be.true;
          })
          .then(function () {
            done();
          }, done);
      });
    });

    describe('update', function () {
      it('should update a session', function (done) {

        var newExpireDateTime = utils.addMinutes(Date.now(), 60);
        newSession.expireDateTime = newExpireDateTime;

        sessionDAL.update(newSession)
          .then(function (data) {
            return sessionDAL.get(newSession._id);
          })
          .then(function (data) {
            expect(data).to.not.be.null;
            expect(data._id.equals(newSession._id)).to.be.true;
            expect(data.expireDateTime.getTime() === newExpireDateTime.getTime()).to.be.true;
          })
          .then(function () {
            done();
          }, done);
      });

    });

    describe('deleteOld', function () {

      var newSession;
      beforeEach(function (done) {

        newSession = {
          userId: user._id,
          expireDateTime: utils.addMinutes(Date.now(), 30)
        };

        sessionDAL.create(newSession)

        .then(function (data) {
            newSession = data;
          })
          .then(function () {
            done();
          }, done);
      });

      it('should delete sessions older than passed date', function (done) {

        // we start off with 2 sessions. One is from way earlier beforeEach
        var minDateToKeep = utils.addMilliseconds(newSession.expireDateTime, 0);

        sessionDAL.deleteOld(minDateToKeep)
          .then(function (data) {
            // console.log('deleted: ' + data);
          })
          .then(function (data) {
            return sessionDAL.Model.find().exec();
          })
          .then(function (data) {
            expect(data).to.not.be.null;
            expect(data).to.have.length(1);
          })
          .then(function () {
            done();
          }, done);
      });
    });
  });
});
