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

Logger.prototype.success = function (functionName, msg, data) {
  this.log('Success', this.fileName, functionName, msg, data);
};

Logger.prototype.info = function (functionName, msg, data) {
  this.log('Info', this.fileName, functionName, msg, data);
};

Logger.prototype.error = function (functionName, msg, data) {
  this.log('Error', this.fileName, functionName, msg, data);
};

Logger.prototype.log = function (type, fileName, functionName, msg, data) {

  if (msg == null) {
    msg = '';
  }

  if (data != null) {
    data = ': ' + JSON.stringify(data);
  } else {
    data = '';
  }

  if (Logger.logFlag) {
    console.log();
    console.log(type + ': ' + this.fileName + ': ' + functionName);
    console.log(msg, data);
  }
};

Logger.logFlag = false;

module.exports = {
  create: create,
  config: config

};
