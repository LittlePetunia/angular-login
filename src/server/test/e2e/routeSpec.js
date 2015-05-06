// // src/server/test/e2e/todo.route.spec.js
// 'use strict';
//
// /* global before */
// /* global after */
//
// process.env.NODE_ENV = 'test';
//
// var mongoose = require('mongoose');
// var request = require('supertest');
// var should = require('should');
// var testUtils = require('../../common/testUtils.js');
// var app = require('../../app.js');
// var todoDAL = require('../../data/todo.js');
// var testData = require('./todo.data.js');
// var path = require('path');
//
// var dbUri = 'mongodb://localhost/todo_test';
// var usersRootUri = '/api/users';
// var fakeTodoId = '5536a74e354d000000000000';
//
// var todoData;
//
// var urlHelper = {
//   get: function(userId){
//     return path.join(usersRootUri, userId.toString(), 'todos');
//   },
//   post: function(userId){
//     return path.join(usersRootUri, userId.toString(), 'todos');
//   },
//   put: function(userId, todoId){
//     return path.join(usersRootUri, userId.toString(), 'todos', todoId.toString());
//   },
//   delete: function(userId, todoId){
//     return path.join(usersRootUri, userId.toString(), 'todos', todoId.toString());
//   }
// };
//
//
//
//
// describe('Todo route', function(){
//
//   // open db connection if needed (if mocha stays active between runs then connection still exists)
//   before(function (done) {
//     testUtils.connect(mongoose, dbUri, done);
//   });
//
//   // clear any data from todo collection
//   beforeEach(function (done) {
//     // console.log('before: removing all todo items');
//     todoDAL.Model.remove({}, function(err){
//      done(err);
//    });
//   });
//
//   beforeEach(function(done){
//     todoData = testData();
//
//     var promise;
//     todoData.todoList.forEach(function(item, idx){
//       if(!promise){
//         promise = todoDAL.add(item.userId, item);
//       }
//       else{
//         promise = promise.chain(todoDAL.add(item.userId, item));
//       }
//     });
//     promise.then(function(){done();}, done);
//   });
//
//   after(function(done){
//     testUtils.closeConnection(mongoose, done);
//   });
//
//
//   it('should get all todos for user #2', function(done){
//
//     request(app)
//       .get(urlHelper.get(todoData.userId2))
//       .expect(200)
//       .accept('json')
//       .end(function(err, res){
//         should.not.exist(err);
//         should.exist(res.body);
//         res.body.length.should.be.equal(3);
//         done();
//       });
//   });
//
//
//   it('should post a new todo for user #2', function(done){
//
//     // post
//     request(app)
//     .post(urlHelper.post(todoData.userId2))
//     .send({title:'new todo', notes: 'notes for new todo'})
//     .expect(201) // created
//     .accept('json')
//     .end(function(err, res){
//       should.not.exist(err);
//       should.exist(res.body);
//
//       // get
//       request(app)
//       .get(urlHelper.get(todoData.userId2))
//       .expect(200)
//       .accept('json')
//       .end(function(err, res){
//         should.not.exist(err);
//         should.exist(res.body);
//         res.body.length.should.be.equal(4);
//         done();
//       });
//     });
//   });
//
//   it('should return error when posting a todo with non-null todo.userId', function(done){
//
//     // post
//     request(app)
//     .post(urlHelper.post(todoData.userId2))
//     .send({_id: fakeTodoId, title:'new todo', notes: 'notes for new todo'})
//     .expect(400) // bad request
//     .accept('json')
//     .end(function(err, res){
//       should.not.exist(err);
//       should.exist(res.body);
//
//       done();
//     });
//   });
//
//   it('should update a todo for user #2', function(done){
//
//     var newTitle = 'test #2.5';
//
//     request(app)
//       // get
//       .get(urlHelper.get(todoData.userId2))
//       .expect(200)
//       .accept('json')
//       .end(function(err, res){
//         should.not.exist(err);
//         should.exist(res.body);
//         res.body.length.should.be.equal(3);
//         var todoToUpdate = res.body[0];
//         todoToUpdate.title = newTitle;
//
//         // put
//         request(app)
//         .put(urlHelper.put(todoData.userId2, todoToUpdate._id))
//         .send(todoToUpdate)
//         .expect(200)
//         .accept('json')
//         .end(function(err, res){
//           should.not.exist(err);
//
//         // get
//         request(app)
//         .get(urlHelper.get(todoData.userId2))
//         .expect(200)
//         .accept('json')
//         .end(function(err, res){
//           should.not.exist(err);
//           should.exist(res.body);
//           var updatedTodoArr = res.body.filter(function(val){
//             return val._id === todoToUpdate._id;
//           });
//           updatedTodoArr.length.should.be.equal(1);
//           updatedTodoArr[0].title.should.be.equal(newTitle);
//           done();
//         }); // end get 2
//       }); // end put
//     }); // end get 1
//   });// end it
//
//   it('should throw exception if attempt too update a todo with no userId for user #2', function(done){
//
//     request(app)
//       // get
//       .get(urlHelper.get(todoData.userId2))
//       .expect(200)
//       .accept('json')
//       .end(function(err, res){
//         should.not.exist(err);
//         should.exist(res.body);
//         res.body.length.should.be.equal(3);
//         var todoToUpdate = res.body[0];
//         var id = todoToUpdate._id;
//         todoToUpdate._id = null;
//
//         // put
//         request(app)
//         .put(urlHelper.put(todoData.userId2, id))
//         .send(todoToUpdate)
//         .expect(400)
//         .accept('json')
//         .end(function(err, res){
//           should.not.exist(err);
//
//           done();
//       }); // end put
//     }); // end get 1
//   });// end it
//
//   it('should return error when updating a todo with different userId than path userId', function(done){
//
//     request(app)
//       // get
//       .get(urlHelper.get(todoData.userId2))
//       .expect(200)
//       .accept('json')
//       .end(function(err, res){
//         should.not.exist(err);
//         should.exist(res.body);
//         res.body.length.should.be.equal(3);
//         var todoToUpdate = res.body[0];
//         var id = todoToUpdate._id;
//         todoToUpdate._id = fakeTodoId;
//
//         // put
//         request(app)
//         .put(urlHelper.put(todoData.userId2, id))
//         .send(todoToUpdate)
//         .expect(400)
//         .accept('json')
//         .end(function(err, res){
//           should.not.exist(err);
//
//           done();
//       }); // end put
//     }); // end get 1
//   });// end it
//
//
//   it('should delete a todo for user #2', function(done){
//     request(app)
//       // get
//       .get(urlHelper.get(todoData.userId2))
//       .expect(200)
//       .accept('json')
//       .end(function(err, res){
//         should.not.exist(err);
//         should.exist(res.body);
//         res.body.length.should.be.equal(3);
//         var todoToDelete = res.body[0];
//
//         // delete
//         request(app)
//         .delete(urlHelper.put(todoData.userId2, todoToDelete._id))
//         .send(todoToDelete)
//         .expect(200)
//         .accept('json')
//         .end(function(err, res){
//           should.not.exist(err);
//
//           // get
//           request(app)
//           .get(urlHelper.get(todoData.userId2))
//           .expect(200)
//           .accept('json')
//           .end(function(err, res){
//             should.not.exist(err);
//             should.exist(res.body);
//             res.body.length.should.be.equal(2);
//
//             res.body.filter(function(val){
//               return val._id === todoToDelete._id;
//             })
//             .length.should.be.equal(0);
//
//             done();
//           }); // end get 2
//       }); // end delete
//     }); // end get 1
//   });// end it
//
//   it('should return error if attempt to delete a non-existent todo for user #2', function(done){
//
//     // delete
//     request(app)
//     .delete(urlHelper.put(todoData.userId2, fakeTodoId))
//     .send()
//     .expect(404)
//     .accept('json')
//     .end(function(err, res){
//       should.not.exist(err);
//       // console.log(res.body);
//       should.exist(res.body);
//        res.body.message.should.equal('Todo not found with id ' + fakeTodoId + ' for user ' + todoData.userId2);
//       done();
//     });
//   });
// });
