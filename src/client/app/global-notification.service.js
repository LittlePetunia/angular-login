(function (angular) {
  'use strict';

  angular.module('app')
    .factory('GlobalNotificationSvc', GlobalNotificationSvc);

  // NotificationSvc.$inject = [];

  function GlobalNotificationSvc() {

    var notifications = [];
    var id = 0;
    var clearSignal = false;

    var NotificationType = {
      error: 'error',
      success: 'success',
      info: 'info'
    };

    var NotificationMode = {
      single: 'single',
      multiple: 'multiple'
    };

    function nextId() {
      id = (id + 1) % 100;
      return id;
    }

    function Notification(msg, type, mode, timeout, header, html) {
      this.message = msg;
      this.type = type;
      this.id = nextId();
      this.mode = mode;

      this.timeout = timeout;
      // implement this later
      // this.html = html;
      // this.header = header;
    }

    function add(msg, type, mode, timeout, header, html) {
      if(typeof msg === 'string')
      {
        notifications.push(new Notification(msg, type, mode,timeout, header, html));
      }
      else{
        // msg is config object
        var config = msg;
        notifications.push(new Notification(config.msg, config.type, config.mode,config.timeout, config.header, config.html));
      }
    }

    function addError(msg, mode,timeout) {
      add(msg, NotificationType.error, timeout, mode);
    }

    function addSuccess(msg, mode,timeout) {
      add(msg, NotificationType.success, timeout, mode);
    }

    function addInfo(msg, mode,timeout) {
      add(msg, NotificationType.info, timeout, mode);
    }

    function clear() {
      setClearSignal(true);
    }

    function count() {
      return notifications.length;
    }

    function hasNext() {
      return notifications.length > 0;
    }

    function next() {
      if (notifications.length === 0) {
        return null;
      }
      return notifications.shift();
    }

    function getClearSignal() {
      return clearSignal;
    }

    function setClearSignal(val) {
      clearSignal = val;
    }

    return {
      add: add,
      addError: addError,
      addSuccess: addSuccess,
      addInfo: addInfo,
      count: count,
      hasNext: hasNext,
      next: next,
      clear: clear,
      getClearSignal: getClearSignal,
      setClearSignal: setClearSignal
    };
  }

}(this.angular));
