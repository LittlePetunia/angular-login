(function (angular) {
  'use strict';

  angular.module('app')
    .factory('NotificationSvc', NotificationSvc);

  NotificationSvc.$inject = [];

  function NotificationSvc() {

    var notifications = [];

    function add(not) {
      notifications.push(not);
    }

    function removeAll() {
      var ret = angular.copy(notifications);
      clear();
      return ret;
    }

    function clear() {
      notifications = [];
    }

    function count() {
      return notifications.length;
    }

    function next() {
      if (notifications.length === 0) {
        return null;
      }
      return notifications.shift();
    }

    return {
      add: add,
      removeAll: removeAll,
      clear: clear,
      count: count,
      next: next
    };
  }

}(this.angular));
