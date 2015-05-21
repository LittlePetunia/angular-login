(function (angular) {
  'use strict';

  angular.module('app')
    .factory('GlobalNotificationSvc', GlobalNotificationSvc);

  // NotificationSvc.$inject = [];

  function GlobalNotificationSvc() {

    var notifications = [];
    var nextNotifications = [];
    var id = 0;
    var clearSignal = false;
    var nextSignal = false;

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

    function switchToNext() {
      setNextSignal(false);

      notifications = nextNotifications;
      nextNotifications = [];
    }

    function Notification(msg, type, mode, timeout, header, html) {

      // validation
      if(msg == null) {
        throw new Error('Notification message cannot be empty/null');
      }

      if(!NotificationType[type]) {
        throw new Error('Invalid message type: ' + type);
      }

      if(mode) {
        if(!NotificationMode[mode]) {
          throw new Error('Invalid message mode: ' + type);
        }
      } else {
        mode = NotificationMode.single;
      }

      this.message = msg;
      this.type = type;
      this.id = nextId();
      this.mode = mode;

      this.timeout = timeout;
      // implement this later
      // this.html = html;
      // this.header = header;
    }

    function addNext(msg, type, mode, timeout, header, html) {

      if(typeof msg === 'string') {
        add(msg, type, mode, timeout, header, html, true);
      } else {
        // msg is config object
        var config = msg;
        config.nextState = true;
        add(config);
      }
    }

    function add(msg, type, mode, timeout, header, html, nextState) {

      if(msg == null || typeof msg === 'string' && msg.length === 0) {
        throw new Error('Notification message cannot be empty/null');
      }

      var n;
      if(typeof msg === 'string') {
        n = nextState ? nextNotifications : notifications;
        n.push(new Notification(msg, type, mode, timeout, header, html));
      } else {
        // msg is config object
        var config = msg;
        n = config.nextState ? nextNotifications : notifications;

        n.push(new Notification(config.message, config.type, config.mode, config.timeout, config.header,
          config.html));
      }
    }

    function addError(msg, mode, timeout, header, html, nextState) {
      add(msg, NotificationType.error, mode, timeout, header, html, nextState);
    }

    function addSuccess(msg, mode, timeout, header, html, nextState) {
      add(msg, NotificationType.success, mode, timeout, header, html, nextState);
    }

    function addInfo(msg, mode, timeout, header, html, nextState) {
      add(msg, NotificationType.info, mode, timeout, header, html, nextState);
    }

    function addNextError(msg, mode, timeout, header, html) {
      add(msg, NotificationType.error, mode, timeout, header, html, true);
    }

    function addNextSuccess(msg, mode, timeout, header, html) {
      add(msg, NotificationType.success, mode, timeout, header, html, true);
    }

    function addNextInfo(msg, mode, timeout, header, html) {
      add(msg, NotificationType.info, mode, timeout, header, html, true);
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
      if(notifications.length === 0) {
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

    function getNextSignal() {
      return nextSignal;
    }

    function setNextSignal(val) {
      // console.log('setNextSignal', val);

      nextSignal = val;
    }

    return {
      add: add,
      addNext: addNext,

      addError: addError,
      addSuccess: addSuccess,
      addInfo: addInfo,

      addNextError: addNextError,
      addNextSuccess: addNextSuccess,
      addNextInfo: addNextInfo,

      count: count,
      hasNext: hasNext,
      next: next,
      clear: clear,
      getClearSignal: getClearSignal,
      setClearSignal: setClearSignal,
      getNextSignal: getNextSignal,
      setNextSignal: setNextSignal,
      switchToNext: switchToNext
    };
  }

}(this.angular));
