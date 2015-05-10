'use strict';

function create(fileName) {
  return new Logger(fileName);
}

function config(cfg) {
  Logger.logFlag = cfg.logFlag;
}

function Logger(fileName) {
  this.fileName = fileName;
}

Logger.prototype.info = function (functionName, msg, data) {
  // console.log('Logger.logFlag: ' + Logger.logFlag);
  // console.log('this.logFlag: ' + this.logFlag);
  if (Logger.logFlag) {
    console.log();
    console.log('Info' + ': ' + this.fileName + ': ' + functionName);
    console.log(this.format('Info', this.fileName, functionName, msg, data));
  }
};

Logger.prototype.error = function (functionName, msg, data) {
  if (Logger.logFlag) {
    console.log();
    console.log('Error' + ': ' + this.fileName + ': ' + functionName);
    console.log(this.format('Error', this.fileName, functionName, msg, data));
  }
};

Logger.prototype.format = function (type, fileName, functionName, msg, data) {
  var arr = [];
  if (msg != null) {
    // msg = ': ' + msg;
    msg = msg;
  } else {
    msg = '';
  }
  if (data != null) {
    data = ': ' + JSON.stringify(data);
  } else {
    data = '';
  }

  //return type + ': ' + fileName + ': ' + functionName + msg + data;
  return msg + data;
};

Logger.logFlag = false;

module.exports = {
  create: create,
  config: config

};
