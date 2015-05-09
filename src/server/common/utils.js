// server/common/utils.js

'use strict';

module.exports = {
  cloneDeep: cloneDeep,
  addDays: addDays,
  addHours: addHours,
  addMinutes: addMinutes,
};

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function addDays(date, days) {

  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function addHours(date, hours) {

  var newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

function addMinutes(date, minutes) {

  var newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}
