// // routes.api.todos.js
//
// var express = require('express');
// var router = express.Router();
// var path = require('path');
// var mongoose = require('mongoose');
//
// // var UserEvents = require('./../../data/user-events.js');
// var Todo = require('./../../data/todo.js');
//
//
// // GET
// router.get('/users/:userId/todos', function(req, res, next) {
//   'use strict';
//
//   // console.log('get called');
//   var userId = req.params.userId;
//
//   Todo.get({ userId: userId })
//   .then(onSuccess(200, res), onError(500, res));
//
// });
//
//
// // POST
// router.post('/users/:userId/todos', function(req, res, next) {
//   'use strict';
//
// // console.log('posting data!!');
//
//   var userId = req.params.userId;
//
//   if(!req.body){
//     return res.status(400) // 400: bad request
//       .json('body must contain a todo object json');
//   }
//   // make sure this doesn't exist already. cannot have an _id
//   if(req.body._id){
//     console.log('cannot have an id');
//     return res.status(400) // 400: bad request
//     //.json(new Error('new todo object _id must be null. _id: ' + req.body._id));
//       .json({message: 'new todo object _id must be null. _id: ' + req.body._id});
//   }
//
//   // 201: created
//   Todo.add(userId, req.body)
//   .then(onSuccess(201, res), onError(500, res));
//
// });
//
//
// // DELETE
// router.delete('/users/:userId/todos/:todoId', function (req, res, next){
//   'use strict';
//
//   var userId = req.params.userId;
//   var todoId = req.params.todoId;
//
//   Todo.deleteById(userId, todoId)
//   .then(onSuccess(200, res), onError(500, res));
//
// });
//
//
// // PUT
// router.put('/users/:userId/todos/:todoId', function (req, res, next){
//   'use strict';
//
//   var userId = Number(req.params.userId);
//   var todoId = req.params.todoId;
//   var todo = req.body;
//
//   if(!todo.userId){
//     return res.status(400) // 400: bad request
//       .json('userId of object is not defined or is null');
//   }
//
//   if(Number(todo.userId) !== userId){
//
//
//     return res.status(400) // 400: bad request
//       .json('userId of object does not match userId in path. object userId: ' +
//             todo.userId + ' path userId: ' + userId + ' ' +
//             'obj type: ' + typeof(todo.userId) + ' userId type: ' + typeof(userId));
//   }
//
//   // validate
//   if(!todo._id || String(todo._id) !== String(todoId)){
//     return res.status(400) // 400: bad request
//     .json('id of object does not match id in path. object _id: ' + todo._id + ' path id: ' + todoId);
//   }
//
//   Todo.update(todo)
//   .then(onSuccess(200, res), onError(500, res));
//
// });
//
//
// function onSuccess(code, res){
//   'use strict';
//
//   // console.log('success call constructed');
//
//
//   return function(data){
//     // console.log('success call called');
//
//     return res.status(code).json(data);
//   };
// }
// function onError(code, res){
//   'use strict';
//
//   // console.log('error call constructed');
//
//
//   return function(err){
//     console.log('failure: ' + err);
//     // console.log('error call called');
//
//
//     code = err.statusCode || code || 500;
//     var msg = err.message || err;
//
//     // console.log('error response: ' + JSON.stringify(msg));
//     return res.status(code)
//       .json({message: msg});
//   };
// }
//
// module.exports = router;
