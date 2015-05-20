(function (angular) {
  'use strict';

  angular.module('app')
    .directive('globalNotification', globalNotification);

  globalNotification.$inject = ['GlobalNotificationSvc'];

  function globalNotification(GlobalNotificationSvc) {

    return {
      restrict: 'E',
      scope: {

      },

      link: function (scope, element, attrs) {

        var removedNotifications = [];
        var myNotifications = [];
        // var notificationId = 0;

        $(element).append('<div><ul></ul></div>');

        scope.$watch(function () {
            return GlobalNotificationSvc.count();
          },
          // function (newVal, oldVal) {
          function () {

            while (GlobalNotificationSvc.hasNext()) {

              var n = GlobalNotificationSvc.next();
              myNotifications.push(n);

              var html = '' +
                '<li class="notification notification-new notification-' + n.type + '" data-notificationId=\'' +
                n.id + '\'>' +
                '<button class="notification-close" >&times;</button>' +
                '<span class="notification-text">' + n.message + '</span>' +
                '</li>';

              $(element).find('ul').append(html);
            }
          });

        $(element).on('click', 'li button', function (evt) {

          var el = $(evt.currentTarget).closest('li');
          if (el.hasClass('notification-removed')) {
            // handle multiple clicks while transitionining
            return;
          }

          var id = parseInt(el.attr('data-notificationId'));

          for (var i = 0; i < myNotifications.length; i++) {
            if (myNotifications[i].id === id) {
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
