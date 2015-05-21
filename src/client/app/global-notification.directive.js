(function (angular) {
  'use strict';

  angular.module('app')
    .directive('globalNotification', globalNotification);

  globalNotification.$inject = ['$rootScope', '$compile', '$timeout', 'GlobalNotificationSvc'];

  function globalNotification($rootScope, $compile, $timeout, GlobalNotificationSvc) {

    $rootScope.$on('$stateChangeSuccess', function () {
      GlobalNotificationSvc.setNextSignal(true);

    });

    return {
      restrict: 'E',
      scope: {},

      link: function (scope, element, attrs) {

        var removedNotifications = {};
        var globalNotifications = {};

        function removeNotification(id) {
          var el = element.find('li[data-notificationId="' + id + '"]');
          if(el.length > 0) {
            el.remove();
          }

          removedNotifications[id] = globalNotifications[id];
          delete globalNotifications[id];
        }

        function clearNotifications() {
          for(var key in globalNotifications) {
            if(globalNotifications.hasOwnProperty(key)) {
              removeNotification(key);
            }
          }
        }

        function restoreNotification(id) {
          globalNotifications[id] = removedNotifications[id];
          delete scope.removedNotifications[id];
          // then need to render it preferably in same position....
        }

        $(element).append('<div><ul></ul></div>');
        var ul = $(element).find('ul');

        // watch clear signal
        scope.$watch(function () {
            var nextSignal = GlobalNotificationSvc.getNextSignal();
            return nextSignal;
          },
          function (newVal, oldVal) {
            if(newVal) {
              clearNotifications();
              GlobalNotificationSvc.switchToNext();
            }
          }
        );

        // watch clear signal
        scope.$watch(function () {
            return GlobalNotificationSvc.getClearSignal();
          },
          function (newVal, oldVal) {
            if(newVal) {
              clearNotifications();
              GlobalNotificationSvc.setClearSignal(false);
            }
          }
        );

        // watch notification count
        scope.$watch(function () {
            return GlobalNotificationSvc.count();
          },
          function () {

            while(GlobalNotificationSvc.hasNext()) {

              var n = GlobalNotificationSvc.next();
              if(n.mode === 'single') {
                clearNotifications();
              }

              globalNotifications[n.id] = n;

              var html = '' +
                '<li class="notification notification-new notification-' + n.type + '"' +
                ' data-notificationId="' + n.id + '">' +
                '<button class="notification-close" >&times;</button>' +
                '<span class="notification-text">' + n.message + '</span>' +
                '</li>';

              ul.append(html);

              if(n.timeout) {
                var el = ul.children('li').last();
                removeElement(el[0], n.id, n.timeout);
              }
            }
          });

        function removeElement(el, notificationId, timeout) {

          $timeout(function () {

            $(el).toggleClass('notification-new notification-removed')
              .one('webkitTransitionEnd oTransitionEnd transitionend', function (e) {
                removeNotification(notificationId);
              });
          }, timeout, false);
        }

        $(element).on('click', 'li button', function (evt) {

          var el = $(evt.currentTarget).closest('li');
          if(el.hasClass('notification-removed')) {
            // handle multiple clicks while transitionining
            return;
          }

          var id = parseInt(el.attr('data-notificationId'));
          removeElement(el, id);
        });
      }

    };
  }

}(this.angular));
