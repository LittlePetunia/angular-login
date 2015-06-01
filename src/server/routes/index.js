// routes/index.js

module.exports = function (app, passport) {
  'use strict';

  // mount todo routes on api
  app.use('/', require('./auth.js')(passport));
  app.use('/', require('./ui/index.js'));
  app.use('/api/', require('./api/users.js'));

};
