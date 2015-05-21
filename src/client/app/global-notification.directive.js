(function (angular) {
  'use strict';

  angular.module('app')
    .directive('globalNotification', globalNotification);

  globalNotification.$inject = ['$compile', '$timeout', 'GlobalNotificationSvc'];

  function globalNotification($compile, $timeout, GlobalNotificationSvc) {

    return {
      restrict: 'E',
      scope: {

      },

      link: function (scope, element, attrs) {

        var removedNotifications = {};
        scope.globalNotifications = {};
        var idSuffix = 'gn_';

        function removeNotification(id) {
          var el = element.find('li[data-notificationId="' + id + '"]');
          if(el.length > 0) {
            el.remove();
          }
          removedNotifications[id] = scope.globalNotifications[id];
          delete scope.globalNotifications[id];
        }

        function restoreNotification(id) {
          scope.globalNotifications[id] = removedNotifications[id];
          delete scope.removedNotifications[id];
          // then need to render it preferably in same position....
        }

        function clearNotifications() {
          for(var key in scope.globalNotifications) {
            if(scope.globalNotifications.hasOwnProperty(key)) {
              removeNotification(key);
            }
          }
        }

        $(element).append('<div><ul></ul></div>');
        var ul = $(element).find('ul');

        // watch clear signal
        scope.$watch(function () {
            return GlobalNotificationSvc.getClearSignal();
          },
          // function (newVal, oldVal) {
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
          // function (newVal, oldVal) {
          function () {

            while(GlobalNotificationSvc.hasNext()) {

              var n = GlobalNotificationSvc.next();
              if(n.mode === 'single') {
                clearNotifications();
              }

              scope.globalNotifications[n.id] = n;

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
