// routes/index.js

module.exports = function (app) {
  'use strict';

  // mount todo routes on api
  app.use('/', require('./auth.js'));
  app.use('/', require('./ui/index.js'));
  app.use('/api/', require('./api/users.js'));

};
