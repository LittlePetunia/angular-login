// separated this into model/data-access files

// module.exports = (function () {
//   'use strict';
//
//   var mongoose = require('mongoose');
//   // var mongooseUtils = require('../common/mongooseUtils.js');
//   // var mpromise = reuqire('mpromise');
//
//   // unit tests use this require multiple times so can have this model already defined
//   // which gives an error
//   var UserModel;
//
//   if (mongoose.models.User) {
//     // console.log('Using existing todo model');
//     UserModel = mongoose.model('User');
//   } else {
//
//     // console.log('Creating new todo model');
//     var UserSchema = new mongoose.Schema({
//       userName: {
//         type: String,
//         unique: true,
//         required: '{PATH} is required',
//         minlength: 8,
//         maxlength: 100
//       },
//       password: {
//         type: String,
//         required: '{PATH} is required',
//         minlength: 8,
//         maxlength: 100
//       },
//       email: {
//         type: String,
//         required: '{PATH} is required',
//         unique: true,
//         match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
//       },
//       firstName: {
//         type: String,
//         required: '{PATH} is required',
//         minlength: 1,
//         maxlength: 100
//       },
//       lastName: {
//         type: String,
//         required: '{PATH} is required',
//         minlength: 1,
//         maxlength: 100
//       },
//       createdDateTime: {
//         type: Date,
//         default: Date.now,
//         required: '{PATH} is required'
//       }
//     });
//
//     UserModel = mongoose.model('User', UserSchema);
//
//     // // can't I put this on the schema directly?
//     // UserModelschema.path('userName').validate(function (val) {
//     //   if(val === null || val === undefined || val.length >= 8){
//     //     return false;
//     //   }
//     //   return true;
//     // }, 'Mininum length is 8');
//   }
//
//   // function isWhitespaceDateValue(val){
//   //   console.log('val test: ' + !/\S/.test(val) + ' [' + val + ']');
//   //   return(val != null && Object.prototype.toString.call(val) !== '[object Date]' && !/\S/.test(val));
//   // }
//
//   function get(condition) {
//
//     return UserModel.find(condition).exec();
//   }
//
//   function getByUserId(userId) {
//
//     return get({
//       userId: userId
//     });
//   }
//
//   function add(userId, todo) {
//     todo._id = null;
//     todo.userId = userId;
//     var newUser = new UserModel(todo);
//     return newUser.save();
//   }
//
//   function deleteById(userId, todoId) {
//
//     return UserModel.findOneAndRemove({
//         _id: todoId,
//         userId: userId
//       }).exec()
//       .then(function (data) {
//         if (!data) {
//           var error = new Error();
//           error.message = 'User not found with id ' + todoId + ' for user ' + userId;
//           error.statusCode = 404; // not found
//           throw error;
//         }
//       });
//   }
//
//   function update(todo) {
//
//     var error;
//     if (!todo._id || !todo.userId) {
//
//       error = new Error();
//       error.message = 'update operation requires todo object to have _id and userId';
//       error.statusCode = 400; // bad request
//       throw error;
//     }
//
//     return UserModel.findOne({
//         _id: todo._id,
//         userId: todo.userId
//       }).exec()
//       .then(function (dbUser) {
//
//         if (!dbUser) {
//           error = new Error();
//           error.message = 'User not found with id ' + todo._id + ' for user ' + todo.userId;
//           error.statusCode = 404; // not found
//           throw error;
//         }
//
//         mongooseUtils.copyFieldsToModel(todo, dbUser);
//
//         return dbUser.save();
//       });
//   }
//
//   return {
//     Model: UserModel,
//     add: add,
//     get: get,
//     getByUserId: getByUserId,
//     deleteById: deleteById,
//     update: update
//
//   };
// }());
