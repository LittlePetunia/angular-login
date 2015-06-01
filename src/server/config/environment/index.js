// index.js
'use strict';

var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'dev',

  port: process.env.PORT || 3000,

  mongoose: {}

}

//
// // TODO: create module for mongoose setup
// var dbName = 'login';
//
// if(env === 'test') {
//   dbName = 'login_test';
//   connectionString = 'mongodb://localhost/' + dbName;
// } else if(env === 'pro') {
//   var mongodbUri = process.env.MONGOLAB_URI; //'mongodb://user:pass@host:port/db';
//   console.log('MONGO_URI: ' + process.env.MONGOLAB_URI);
//
//   var mongoUriUtil = require('mongodb-uri');
//   connectionString = mongoUriUtil.formatMongoose(mongodbUri);
//   console.log('Mongo connection string: ' + connectionString);
//
// } else {
//   connectionString = 'mongodb://localhost/' + dbName;
// }
//
// mongoose.connect(connectionString);
//
// var db = mongoose.connection;
//
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', function () {
//   console.log('Connected to MongoDB');
// });

_.merge(all, require('./' + 'secrets' + '.js'));
_.merge(all, require('./' + all.env + '.js'));

console.log('config');
console.log(all);
module.exports = all;
