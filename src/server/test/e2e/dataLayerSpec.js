// // src/server/test/e2e/todoSpec.js
// 'use strict';
//
// /* global before */
// /* global after */
//
// var should = require('should');
// var mongoose = require('mongoose');
// var todoRoute = require('../../routes/api/todos.js');
// var todoDAL = require('../../data/todo.js');
// var dateUtils = require('../../common/dateUtils.js');
// var testUtils = require('../../common/testUtils.js');
// var testData = require('./todo.data.js');
//
// var dbUri = 'mongodb://localhost/todo_test';
//
//
// describe('todo DAL', function(){
//
//   var todoData;
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
//
//   beforeEach(function(done){
//
//     todoData = testData(); // refresh test data in case it was modified by test.
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
//
//     promise.then(function(){done();}, done);
//
//   });
//
//   after(function(done){
//     testUtils.closeConnection(mongoose, done);
//   });
//
//
//   // validate we can create, update, delete, get with DAL
//   // We will do more extensive integration test later with routes
//   it('should get all items for user #2', function(done){
//     todoDAL.getByUserId(todoData.userId2)
//       .then(function(data){
//         should.exist(data);
//         data.should.be.instanceof(Array);
//         data.length.should.be.equal(todoData.getTodos(todoData.userId2).length);
//         done();
//       })
//       .onReject(done);
//   });
//
//
//   it('should create an item for user #2', function(done){
//     todoDAL.add(todoData.userId2, {title:'new todo', notes: 'notes for new todo'})
//       .then(function(){
//         return todoDAL.getByUserId(todoData.userId2);
//       })
//       .then(function(data){
//         data.should.be.instanceof(Array);
//         data.length.should.be.equal(todoData.getTodos(todoData.userId2).length + 1);
//
//         data.filter(function(val){
//           return (val.title === 'new todo');
//         })
//         .length.should.be.equal(1);
//
//         done();
//       })
//       .onReject(done);
//   });
//
//
//   it('should update an item for user #2', function(done){
//
//     var newTitle = 'test #2.5';
//     var testTodo;
//
//     todoDAL.get({userId: todoData.userId2, title: 'test #2'})
//       .then(function(data){
//         should.exist(data);
//         data.length.should.equal(1);
//
//         testTodo = data[0];
//         testTodo.title = newTitle;
//
//         return todoDAL.update(testTodo);
//       })
//       .then(function(){
//         return todoDAL.get({userId: todoData.userId2, _id: testTodo._id});
//       })
//       .then(function(data){
//         should.exist(data);
//         data.length.should.equal(1);
//
//         // console.log('updated item ' + data[0]);
//         data[0].title.should.be.equal(newTitle);
//         done();
//       })
//       .onReject(done);
//   });
//
//   it('should delete an item for user #2', function(done){
//     // find item to delete, delete it, check if it was deleted
//
//     var todoToDelete;
//     var originalDataLength;
//
//     todoDAL.getByUserId(todoData.userId2)
//     .then(function(data){
//       should.exist(data);
//       originalDataLength = data.length;
//       todoToDelete = data[0];
//       return todoDAL.deleteById(todoData.userId2, todoToDelete);
//     })
//     .then(function(data){
//       return todoDAL.getByUserId(todoData.userId2);
//     })
//     .then(function(data){
//       data.length.should.be.equal(originalDataLength -1);
//       data.filter(function(val){
//         return val._id === todoToDelete._id;
//       })
//       .length.should.be.equal(0);
//       done();
//     })
//     .onReject(done);
//
//   });
//
//
// });
