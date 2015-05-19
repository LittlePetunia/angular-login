(function (angular) {
  'use strict';

  angular.module('app')
    .directive('notification', notification);

  function notification() {

    return {
      restrict: 'E',
      scope: {
        notifications: '='
      },

      link: function (scope, element, attrs) {

        var removedNotifications = [];
        var myNotifications = [];
        var notificationId = 0;

        $(element).append('<div><ul></ul></div>');

        scope.$watch(function () {
            return scope.notifications ? scope.notifications.length : 0;
          },
          // function (newVal, oldVal) {
          function () {

            while (scope.notifications.length > 0) {

              var n = scope.notifications.pop();
              myNotifications.push(n);
              n.notificationId = ++notificationId;

              var html = '' +
                '<li class="notification notification-new notification-' + n.type + '" data-notificationId=\'' +
                n.notificationId + '\'>' +
                '<button class="notification-close" >&times;</button>' +
                '<span class="notification-text">' + n.message + '</span>' +
                '</li>';

              $(element).find('ul').append(html);
            }
          });

        $(element).on('click', 'li button', function (evt) {

          var el = $(evt.currentTarget).closest('li');
          if (el.hasClass('notification-removed')) {
            return;
          }

          var id = parseInt(el.attr('data-notificationId'));

          for (var i = 0; i < myNotifications.length; i++) {
            if (myNotifications[i].notificationId === id) {
              removedNotifications.push(myNotifications.splice(i, 1));
            }
          }

          el.toggleClass('notification-new notification-removed')
            .one('webkitTransitionEnd oTransitionEnd transitionend', function (e) {
              el.remove();
            });
        });
      }
    };
  }

}(this.angular));
