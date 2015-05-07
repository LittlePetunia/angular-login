// src/server/test/e2e/todo.route.spec.js
'use strict';

/* global before */
/* global after */

process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var request = require('supertest');
/*jshint -W079 */
var expect = require('chai').expect;
var path = require('path');

var testUtils = require('../../common/testUtils.js');
var userDAL = require('../../db-models/user.js');
var app = require('../../app.js');

var dbUri = 'mongodb://localhost/login_test';
var usersRootUri = '/api/users';
var fakeUserId = '5536a74e354d000000000000';

var urlHelper = {
  get: function (userId) {
    if (userId) {
      return path.join(usersRootUri, userId.toString());
    }
    return path.join(usersRootUri);
  },
  post: function () {
    return path.join(usersRootUri);
  },
  put: function (userId) {
    return path.join(usersRootUri, userId.toString());
  },
  delete: function (userId) {
    return path.join(usersRootUri, userId.toString());
  }
};

// function clearUsers(done) {
//   userDAL.Model.remove({}, function (err) {
//     done(err);
//   });
// }

// function createTestUser(done) {
//   console.log('before each running');
//   var user = {
//     userName: 'testUser',
//     password: 'hellokitty',
//     email: 'testuser@mail.com',
//     firstName: 'test',
//     lastName: 'user'
//   };
//
//   userDAL.create(user)
//     .then(function (data) {
//       return userDAL.get({
//         userName: user.userName
//       });
//     })
//     .then(function (data) {
//       expect(data).to.have.length(1);
//       user._id = data[0]._id;
//     })
//     .then(function () {
//       done();
//     }, done);
//
//   return user;
// }

describe('User route', function () {

  // open db connection if needed (if mocha stays active between runs then connection still exists)
  before(function (done) {
    testUtils.connect(mongoose, dbUri, done);
  });

  // clear any data from todo collection
  beforeEach(function (done) {
    userDAL.Model.remove({}, function (err) {
      done(err);
    });
  });

  // insert test user
  var user;
  beforeEach(function (done) {
    // console.log('before each running');
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

  after(function (done) {
    testUtils.closeConnection(mongoose, done);
  });

  describe('GET /users', function () {
    it('should get all users', function (done) {
      // add 1 user then get should return 2 users
      var newUser = {
        userName: 'testUser2',
        password: 'hellokitty2',
        email: 'testuser2@mail.com',
        firstName: 'test2',
        lastName: 'user2'
      };

      request(app)
        .post(urlHelper.post())
        .send(newUser)
        .end(function (err, res) {
          expect(res.status).to.equal(201); //201 Created
          request(app)
            .get(urlHelper.get())
            .end(function (err, res) {
              expect(res.status).to.equal(200);
              expect(res.body.length).to.equal(2);
              done();
            });
        });
    });
  });

  describe('GET /users/:userId', function () {
    it('should get a single user', function (done) {
      request(app)
        .get(urlHelper.get(user._id))
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res).to.not.be.null;
          expect(res.body._id).to.be.equal(user._id.toString());
          done();
        });
    });

    it('should return 404 if user not found', function (done) {
      request(app)
        .get(urlHelper.get(fakeUserId))
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          expect(res.body).to.not.be.null;
          expect(res.body.message).to.be.equal('User not found with id ' + fakeUserId);
          done();
        });
    });
  });

  describe('POST /users', function () {
    it('should create a user', function (done) {

      var newUser = {
        userName: 'testUser2',
        password: 'hellokitty2',
        email: 'testuser2@mail.com',
        firstName: 'test2',
        lastName: 'user2'
      };

      request(app)
        .post(urlHelper.post())
        .send(newUser)
        .end(function (err, res) {
          expect(res.status).to.equal(201); //201 Created
          expect(res.header.location).to.equal(path.join(usersRootUri, res.body._id));
          expect(res.body.userName).to.be.equal(newUser.userName);
          expect(res.body._id).to.not.be.null;
          done();
        });
    });

    it('should return 500 error if no user object sent', function (done) {
      request(app)
        .post(urlHelper.post())
        .send()
        .end(function (err, res) {
          expect(res.status).to.equal(500);
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body.message).to.equal('User validation failed');
          done();
        });
    });

    it('should return error if user property is invalid', function (done) {

      var newUser = {
        userName: '1234567',
        password: 'hellokitty2',
        email: 'testuser2@mail.com',
        firstName: 'test2',
        lastName: 'user2'
      };

      var errorMsg = 'Path `userName` (`' + newUser.userName + '`) ' +
        'is shorter than the minimum allowed';

      request(app)
        .post(urlHelper.post())
        .send(newUser)
        .end(function (err, res) {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.all.keys('name', 'message', 'errors');
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body.message).to.equal('User validation failed');
          expect(res.body.errors).to.have.string(errorMsg);
          done();
        });
    });
  });

  describe('DELETE /users/:userId', function () {
    it('should delete a user', function (done) {
      request(app)
        .delete(urlHelper.delete(user._id))
        .end(function (err, res) {
          expect(res.status).to.equal(204); //204 No Content
          request(app)
            .get(urlHelper.get(user._id))
            .end(function (err, res) {
              expect(res.status).to.equal(404);
              done();
            });
        });
    });

    it('should return 404 if user not found', function (done) {
      request(app)
        .delete(urlHelper.delete(fakeUserId))
        .end(function (err, res) {
          expect(res.status).to.equal(404); //404 not found
          done();
        });
    });
  });

  describe('PUT /users/:userId', function () {
    it('should update a user', function (done) {

      var updateUser = {
        userName: 'testUser2',
        password: 'hellokitty2',
        email: 'testuser2@mail.com',
        firstName: 'test2',
        lastName: 'user2'
      };

      request(app)
        .put(urlHelper.put(user._id))
        .send(updateUser)
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          request(app)
            .get(urlHelper.get(user._id))
            .end(function (err, res) {
              expect(res.status).to.equal(200);
              expect(res.body._id.toString()).to.equal(user._id.toString());
              expect(res.body.userName).to.be.equal(updateUser.userName);
              expect(res.body.email).to.be.equal(updateUser.email);
              expect(res.body.password).to.be.equal(updateUser.password);
              expect(res.body.firstName).to.be.equal(updateUser.firstName);
              expect(res.body.lastName).to.be.equal(updateUser.lastName);
              done();
            });
        });
    });

    it('should return 422 error if user object id differs from url user id', function (done) {
      request(app)
        .put(urlHelper.put(fakeUserId))
        .send(user)
        .end(function (err, res) {
          expect(res.status).to.equal(422); //422 Unprocessable Entity
          expect(res.body.message).to.have.string('id of object does not match id in path.'); //422 Unprocessable Entity
          done();
        });
    });

    it('should return 404 if user not found', function (done) {
      user._id = fakeUserId;
      request(app)
        .put(urlHelper.put(fakeUserId))
        .send(user)
        .end(function (err, res) {
          expect(res.status).to.equal(404); //422 Unprocessable Entity
          done();
        });
    });
  });
});
