// server/common/mongooseUtils.js
'use strict';

module.exports = {
    copyFieldsToModel: copyFieldsToModel
  };



function copyFieldsToModel(source, target){
  for(var prop in source){
    if(prop !== '_id' && prop !== '__v' && source.hasOwnProperty(prop)){
      target[prop] = source[prop];
    }
  }
}
