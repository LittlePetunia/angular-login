// routes/index.js

module.exports = function (app) {
  'use strict';

  // mount todo routes on api
  app.use('/api/', require('./api/users.js'));

  app.use('/', require('./ui/index.js'));

  // app.use('/users???', require('./users.js'));

  // error handling
  //
  // // catch 404 and forward to error handler
  // app.use(function(req, res, next) {
  //   var err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });
  //
  // // error handlers
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.json({msg: err});
  // });

};
