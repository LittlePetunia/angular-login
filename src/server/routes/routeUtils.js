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

    code = err.statusCode || code || 500;
    var name = err.name || 'Unspecified Error';
    var msg;

    if(err.exceptionInfo) {
      msg = err.exceptionInfo.message;
    } else {
      // unhandled error. We won't pass the message but we should log it.
      msg = 'Error occurred';
      // TODO: implement logging system for saving to file and add errors from here
      console.error(err)
    }

    return res.status(code)
      .json({
        name: name,
        message: msg
      });
  };
}
