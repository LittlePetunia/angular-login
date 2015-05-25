// server/common/utils.js
/*
  Common handlers for database request callbacks
  
*/
'use strict';

module.exports = {
  onError: onError,
  onSuccess: onSuccess
};

function onSuccess(code, res) {
  return function (data) {
    return res.status(code).json(data);
  };
}

function onError(code, res) {
  return function (err) {

    // console.log('having an error: ' + JSON.stringify(err));
    // console.log('having an error: ' + err);

    code = err.statusCode || code || 500;
    var name = err.name || 'Unspecified Error';
    var msg = err.message || err;
    // TODO: move error message normalization to the DAL.
    // decode ValidationError and MongoError errors.

    var errors;
    if(err.errors && typeof (err.errors) === 'object' && Object.keys(err.errors).length > 0) {
      if(typeof (err.errors) === 'object') {
        // console.log('errors is object');
        if(Object.keys(err.errors).length > 0) {
          // console.log('errors has keys');
          errors = [];

          var e = err.errors;

          for(var k in e) {
            if(e.hasOwnProperty(k) && e[k].message) {
              // console.log('errors adding message: ' + e[k].message);

              errors.push(e[k].message);
            }
          }

        }
      } else if(typeof (err.errors) === 'string') {
        errors = err.errors;
      } else if(Array.isArray(err.errors)) {
        throw new Error('unhandled error errors list type');
      }
    }

    // console.log('log code: ' + code);
    // console.log('log name: ' + name);
    // console.log('log msg: ' + msg);
    // console.log('log errors: ' + errors);

    // console.log('log status: ' + code);
    // console.log('returning json');
    return res.status(code)
      .json({
        name: name,
        message: msg,
        errors: errors
      });
  };
}
