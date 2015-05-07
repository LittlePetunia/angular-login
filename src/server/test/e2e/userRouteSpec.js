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
    xit('should get all users', function (done) {

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
          expect(res.body.message).to.be.equal(
            'User not found with id ' + fakeUserId);
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
          expect(res.header.location).to.equal(path.join(
            usersRootUri, res.body._id));
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
          expect(res.body.message).to.equal(
            'User validation failed');
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
    xit('should delete a user', function (done) {
      done();
    });

    xit(
      'should return 400 error if user object id differs from url user id',
      function (done) {
        done();
      });

    xit('should return 400 error if user object has no id', function (done) {
      done();
    });

    xit('should return 404 if user not found', function (done) {
      done();
    });
  });

  describe('PUT /users/:userId', function () {
    xit('should update a user', function (done) {
      done();
    });

    xit(
      'should return 400 error if user object id differs from url user id',
      function (done) {
        done();
      });

    xit('should return 400 error if user object has no id', function (done) {
      done();
    });

    xit('should return 404 if user not found', function (done) {
      done();
    });
  });

  // xit('should create a user', function (done) {
  //
  // });

  // it('should get all users for user #2', function(done){
  //
  //   request(app)
  //     .get(urlHelper.get(todoData.userId2))
  //     .expect(200)
  //     .accept('json')
  //     .end(function(err, res){
  //       should.not.exist(err);
  //       should.exist(res.body);
  //       res.body.length.should.be.equal(3);
  //       done();
  //     });
  // });

  // it('should post a new todo for user #2', function(done){
  //
  //   // post
  //   request(app)
  //   .post(urlHelper.post(todoData.userId2))
  //   .send({title:'new todo', notes: 'notes for new todo'})
  //   .expect(201) // created
  //   .accept('json')
  //   .end(function(err, res){
  //     should.not.exist(err);
  //     should.exist(res.body);
  //
  //     // get
  //     request(app)
  //     .get(urlHelper.get(todoData.userId2))
  //     .expect(200)
  //     .accept('json')
  //     .end(function(err, res){
  //       should.not.exist(err);
  //       should.exist(res.body);
  //       res.body.length.should.be.equal(4);
  //       done();
  //     });
  //   });
  // });
  //
  // it('should return error when posting a todo with non-null todo.userId', function(done){
  //
  //   // post
  //   request(app)
  //   .post(urlHelper.post(todoData.userId2))
  //   .send({_id: fakeUserId, title:'new todo', notes: 'notes for new todo'})
  //   .expect(400) // bad request
  //   .accept('json')
  //   .end(function(err, res){
  //     should.not.exist(err);
  //     should.exist(res.body);
  //
  //     done();
  //   });
  // });
  //
  // it('should update a todo for user #2', function(done){
  //
  //   var newTitle = 'test #2.5';
  //
  //   request(app)
  //     // get
  //     .get(urlHelper.get(todoData.userId2))
  //     .expect(200)
  //     .accept('json')
  //     .end(function(err, res){
  //       should.not.exist(err);
  //       should.exist(res.body);
  //       res.body.length.should.be.equal(3);
  //       var todoToUpdate = res.body[0];
  //       todoToUpdate.title = newTitle;
  //
  //       // put
  //       request(app)
  //       .put(urlHelper.put(todoData.userId2, todoToUpdate._id))
  //       .send(todoToUpdate)
  //       .expect(200)
  //       .accept('json')
  //       .end(function(err, res){
  //         should.not.exist(err);
  //
  //       // get
  //       request(app)
  //       .get(urlHelper.get(todoData.userId2))
  //       .expect(200)
  //       .accept('json')
  //       .end(function(err, res){
  //         should.not.exist(err);
  //         should.exist(res.body);
  //         var updatedUserArr = res.body.filter(function(val){
  //           return val._id === todoToUpdate._id;
  //         });
  //         updatedUserArr.length.should.be.equal(1);
  //         updatedUserArr[0].title.should.be.equal(newTitle);
  //         done();
  //       }); // end get 2
  //     }); // end put
  //   }); // end get 1
  // });// end it
  //
  // it('should throw exception if attempt too update a todo with no userId for user #2', function(done){
  //
  //   request(app)
  //     // get
  //     .get(urlHelper.get(todoData.userId2))
  //     .expect(200)
  //     .accept('json')
  //     .end(function(err, res){
  //       should.not.exist(err);
  //       should.exist(res.body);
  //       res.body.length.should.be.equal(3);
  //       var todoToUpdate = res.body[0];
  //       var id = todoToUpdate._id;
  //       todoToUpdate._id = null;
  //
  //       // put
  //       request(app)
  //       .put(urlHelper.put(todoData.userId2, id))
  //       .send(todoToUpdate)
  //       .expect(400)
  //       .accept('json')
  //       .end(function(err, res){
  //         should.not.exist(err);
  //
  //         done();
  //     }); // end put
  //   }); // end get 1
  // });// end it
  //
  // it('should return error when updating a todo with different userId than path userId', function(done){
  //
  //   request(app)
  //     // get
  //     .get(urlHelper.get(todoData.userId2))
  //     .expect(200)
  //     .accept('json')
  //     .end(function(err, res){
  //       should.not.exist(err);
  //       should.exist(res.body);
  //       res.body.length.should.be.equal(3);
  //       var todoToUpdate = res.body[0];
  //       var id = todoToUpdate._id;
  //       todoToUpdate._id = fakeUserId;
  //
  //       // put
  //       request(app)
  //       .put(urlHelper.put(todoData.userId2, id))
  //       .send(todoToUpdate)
  //       .expect(400)
  //       .accept('json')
  //       .end(function(err, res){
  //         should.not.exist(err);
  //
  //         done();
  //     }); // end put
  //   }); // end get 1
  // });// end it
  //
  //
  // it('should delete a todo for user #2', function(done){
  //   request(app)
  //     // get
  //     .get(urlHelper.get(todoData.userId2))
  //     .expect(200)
  //     .accept('json')
  //     .end(function(err, res){
  //       should.not.exist(err);
  //       should.exist(res.body);
  //       res.body.length.should.be.equal(3);
  //       var todoToDelete = res.body[0];
  //
  //       // delete
  //       request(app)
  //       .delete(urlHelper.put(todoData.userId2, todoToDelete._id))
  //       .send(todoToDelete)
  //       .expect(200)
  //       .accept('json')
  //       .end(function(err, res){
  //         should.not.exist(err);
  //
  //         // get
  //         request(app)
  //         .get(urlHelper.get(todoData.userId2))
  //         .expect(200)
  //         .accept('json')
  //         .end(function(err, res){
  //           should.not.exist(err);
  //           should.exist(res.body);
  //           res.body.length.should.be.equal(2);
  //
  //           res.body.filter(function(val){
  //             return val._id === todoToDelete._id;
  //           })
  //           .length.should.be.equal(0);
  //
  //           done();
  //         }); // end get 2
  //     }); // end delete
  //   }); // end get 1
  // });// end it
  //
  // it('should return error if attempt to delete a non-existent todo for user #2', function(done){
  //
  //   // delete
  //   request(app)
  //   .delete(urlHelper.put(todoData.userId2, fakeUserId))
  //   .send()
  //   .expect(404)
  //   .accept('json')
  //   .end(function(err, res){
  //     should.not.exist(err);
  //     // console.log(res.body);
  //     should.exist(res.body);
  //      res.body.message.should.equal('User not found with id ' + fakeUserId + ' for user ' + todoData.userId2);
  //     done();
  //   });
  // });
});
