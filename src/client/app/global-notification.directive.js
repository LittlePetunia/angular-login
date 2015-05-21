(function (angular) {
  'use strict';

  angular.module('app')
    .directive('globalNotification', globalNotification);

  globalNotification.$inject = ['$compile', '$timeout','GlobalNotificationSvc'];

  function globalNotification($compile,$timeout, GlobalNotificationSvc) {

    return {
      restrict: 'E',
      scope: {

      },

      link: function (scope, element, attrs) {

        var removedNotifications = {};
        scope.globalNotifications = {};

        function removeNotification(id) {
          removedNotifications[id] = scope.globalNotifications[id];
          delete scope.globalNotifications[id];
        }

        function restoreNotification(id) {
          scope.globalNotifications[id] = removedNotifications[id];
          delete scope.removedNotifications[id];
          // then need to render it preferably in same position....
        }

          function clearNotifications() {
          for (var key in scope.globalNotifications) {
            if (scope.globalNotifications.hasOwnProperty(key)) {
              delete scope.globalNotifications[key];
            }
          }
        }

        $(element).append('<div><ul></ul></div>');

        // watch clear signal
        scope.$watch(function () {
            return GlobalNotificationSvc.getClearSignal();
          },
          // function (newVal, oldVal) {
          function (newVal, oldVal) {
            if(newVal){
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

            while (GlobalNotificationSvc.hasNext()) {

              var n = GlobalNotificationSvc.next();
              if(n.mode ==='single'){
                clearNotifications();
              }

              scope.globalNotifications[n.id] = n;


              var html = '' +
                '<li ng-if="globalNotifications[' + n.id+ '] != null"  ' +
                ' ng-class="[\'notification\', \'notification-new\', \'notification-\' + globalNotifications[' + n.id + '].type]"' +
                ' data-notificationId="' + n.id  + '">' +
                '<button class="notification-close" >&times;</button>' +
                '<span class="notification-text">{{globalNotifications[' + n.id + '].message}}</span>' +
                '</li>';

              var content = $compile(html)(scope);


              // $(element).find('ul').append(html);
              $(element).find('ul').append(content);

              if(n.timeout){
                var el = $(element).find('ul>li').last();
                removeElement(el[0], n.id, n.timeout);
              }
            }
          });

        function removeElement(el, notificationId, timeout){

          $timeout(function(){
            $(el).toggleClass('notification-new notification-removed')
              .one('webkitTransitionEnd oTransitionEnd transitionend', function (e) {
                // el.remove();
                removeNotification(notificationId);
                scope.$apply();
              });
          },timeout, false);
        }

        $(element).on('click', 'li button', function (evt) {

          var el = $(evt.currentTarget).closest('li');
          if (el.hasClass('notification-removed')) {
            // handle multiple clicks while transitionining
            return;
          }

          var id = parseInt(el.attr('data-notificationId'));

          // for (var i = 0; i < myNotifications.length; i++) {
          //   if (myNotifications[i].id === id) {
          //     removedNotifications.push(myNotifications.splice(i, 1));
          //   }
          // }
          // removedNotifications[id] = globalNotifications[id];
          // delete globalNotifications[id];

          // el.toggleClass('notification-new notification-removed')
          //   .one('webkitTransitionEnd oTransitionEnd transitionend', function (e) {
          //     // el.remove();
          //     removeNotification(id);
          //     scope.$apply();
          //   });

          removeElement(el, id);
        });
      }

    };
  }

}(this.angular));
