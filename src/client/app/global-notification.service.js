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

    function nextId() {
      id = (id + 1) % 100;
      return id;
    }

    function Notification(msg, type, timeoutMs, header, html) {
      this.message = msg;
      this.type = type;
      this.id = nextId();

      // this.timeout = timeoutMs;
      // implement this later
      // this.html = html;
      // this.header = header;
    }

    function add(msg, type, timeoutMs, header, html) {
      notifications.push(new Notification(msg, type, timeoutMs, header, html));
    }

    function addError(msg, timeout) {
      add(msg, NotificationType.error, timeout);
    }

    function addSuccess(msg, timeout) {
      add(msg, NotificationType.success, timeout);
    }

    function addInfo(msg, timeout) {
      add(msg, NotificationType.info, timeout);
    }

    // function removeAll() {
    //   var ret = angular.copy(notifications);
    //   clear();
    //   return ret;
    // }

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
      addError: addError,
      addSuccess: addSuccess,
      addInfo: addInfo,
      clear: clear,
      count: count,
      hasNext: hasNext,
      next: next,
      getClearSignal: getClearSignal,
      setClearSignal: setClearSignal
    };
  }

}(this.angular));
