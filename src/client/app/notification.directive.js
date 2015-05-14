(function (angular) {
  'use strict';

  angular.module('app')
    .directive('notification', notification);

  // notification.$inject = ['NotificationSvc'];

  function notification() {

    return {
      restrict: 'E',
      scope: {},
      templateUrl: '/app/notification.tmpl.html',
      controller: NotificationCtrl,
      controllerAs: 'vm',
      bindToController: {
        notifications: '='
      }
      // link: function (scope, element, attrs) {
      // }
    };
  }

  function NotificationCtrl($scope) {

    var vm = this;
    // now we have vm.notifications available because of bindToController
    // what will we do in here?
    // define functions for modifying the notifications if needed
    // and for handling events in the directive
    // but couldn't we do that in the directive link function?
    // i think so but i want the notification directive to repeat
    // over a controller property so I need a controller (I think)

    vm.remove = remove;

    function remove(el, notif) {
      // set class on element.
      // set timeout to remove notif from array
      // and el from dom

    }
  }

}(this.angular));
