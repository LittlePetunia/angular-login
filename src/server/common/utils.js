// server/common/utils.js


'use strict';

module.exports = {
  cloneDeep: cloneDeep,
  addDays: addDays
  };


function cloneDeep(obj){
  return JSON.parse(JSON.stringify(obj));
}



function addDays(date, days){

  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
