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

describe('Session DAL', function () {

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
        return userDAL.get({
          userName: user.userName
        });
      })
      .then(function (data) {
        expect(data).to.have.length(1);
        user._id = data[0]._id;
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

  // // insert test data
  // beforeEach(function (done) {
  //
  //   session = {
  //     sessionName: 'testUser',
  //     password: 'hellokitty',
  //     email: 'testsession@mail.com',
  //     firstName: 'test',
  //     lastName: 'session'
  //   };
  //
  //   sessionDAL.create(session)
  //     .then(function (data) {
  //       return sessionDAL.get({
  //         sessionName: session.sessionName
  //       });
  //     })
  //     .then(function (data) {
  //       expect(data).to.have.length(1);
  //       session._id = data[0]._id;
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });

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
        console.log(data);
      })
      .then(function () {
        done();
      }, done);
  });

  // it('should create a new session', function (done) {
  //
  //   var newUser = {
  //     sessionName: 'testUser2',
  //     password: 'hellokitty2',
  //     email: 'testsession2@mail.com',
  //     firstName: 'test2',
  //     lastName: 'session2'
  //   };
  //
  //   sessionDAL.create(newUser)
  //     .then(function (data) {
  //       return sessionDAL.get({
  //         sessionName: newUser.sessionName
  //       });
  //     })
  //     .then(function (data) {
  //       expect(data).to.have.length(1);
  //       expect(data[0].sessionName).to.equal(newUser.sessionName);
  //       done();
  //     }, done);
  // });
  //
  // it('should get a session by sessionname', function (done) {
  //   sessionDAL.get({
  //       sessionName: session.sessionName
  //     })
  //     .then(function (data) {
  //       expect(data).to.have.length(1);
  //       expect(data[0].sessionName).to.equal(session.sessionName);
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should get a session by id', function (done) {
  //   sessionDAL.getById(session._id)
  //     .then(function (data) {
  //       expect(data).to.not.be.null;
  //       expect(data.sessionName).to.not.be.null;
  //       expect(data.sessionName).to.equal(session.sessionName);
  //       expect(data._id.equals(session._id)).to.be.true;
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should update a session', function (done) {
  //   var updateUser = {
  //     sessionName: 'newUserName',
  //     password: 'newPassword',
  //     email: 'newUser@mail.com',
  //     firstName: 'newFirstName',
  //     lastName: 'newLastName'
  //   };
  //   updateUser._id = session._id;
  //
  //   sessionDAL.update(updateUser)
  //     .then(function (data) {
  //       return sessionDAL.getById(session._id);
  //     })
  //     .then(function (data) {
  //       expect(data).to.not.be.null;
  //       expect(data.sessionName).to.equal(updateUser.sessionName);
  //       expect(data.password).to.equal(updateUser.password);
  //       expect(data.email).to.equal(updateUser.email);
  //       expect(data.firstName).to.equal(updateUser.firstName);
  //       expect(data.lastName).to.equal(updateUser.lastName);
  //       expect(data._id.equals(updateUser._id)).to.be.true;
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should delete a session', function (done) {
  //   sessionDAL.deleteById(session._id)
  //     .then(function (data) {
  //       return sessionDAL.get({
  //         _id: session._id
  //       });
  //     })
  //     .then(function (data) {
  //       expect(data).length.to.be(0);
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should return 404 error if session not found when getting by id', function (done) {
  //   var fakeId = '554b8b066d4e5b5c11aa0000';
  //
  //   sessionDAL.getById(fakeId)
  //     .then(function (data) {
  //       expect('this should not be called').to.equal('');
  //     }, function (err) {
  //       expect(err.message).to.be.equal('User not found with id ' + fakeId);
  //       expect(err.statusCode).to.be.equal(404); // not found
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should return 404 error if session not found when deleting by id', function (done) {
  //   var fakeId = '554b8b066d4e5b5c11aa0000';
  //
  //   sessionDAL.deleteById(fakeId)
  //     .then(function (data) {
  //       expect('this should not be called').to.equal('');
  //     }, function (err) {
  //       expect(err.message).to.be.equal('User not found with id ' + fakeId);
  //       expect(err.statusCode).to.be.equal(404); // not found
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should return 404 error if session not found when updating', function (done) {
  //   var fakeId = '554b8b066d4e5b5c11aa0000';
  //   session._id = fakeId;
  //   sessionDAL.update(session)
  //     .then(function (data) {
  //       expect('this should not be called').to.equal('');
  //     }, function (err) {
  //       expect(err.message).to.be.equal('User not found with id ' + fakeId);
  //       expect(err.statusCode).to.be.equal(404); // not found
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });
  //
  // it('should return 422 error if no _id set updating', function (done) {
  //   session._id = null;
  //   sessionDAL.update(session)
  //     .then(function (data) {
  //       expect('this should not be called').to.equal('');
  //     }, function (err) {
  //       expect(err.message).to.be.equal('update operation requires session object to have _id');
  //       expect(err.statusCode).to.be.equal(422); // not found
  //     })
  //     .then(function () {
  //       done();
  //     }, done);
  // });

});
