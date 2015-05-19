(function (angular) {
  'use strict';

  angular.module('app')
    .directive('notification', notification);

  // notification.$inject = ['NotificationSvc'];

  function notification() {

    return {
      restrict: 'E',
      scope: {
        notifications: '='
      },
      // templateUrl: '/app/notification.tmpl.html',
      // controller: NotificationCtrl,
      // controllerAs: 'vm',
      // bindToController: {
      //   notifications: '='
      // },
      link: function (scope, element, attrs) {

        var removedNotifications = [];
        var myNotifications = [];
        var notificationId = 0;

        $(element).append('<ul></ul>');

        // check attribute z-index
        // if set
        // get element position. if set absolute do nothing
        // else: get (element).offsetParent()
        // if exists then calulate distance from element to offsetParent
        // and use this for absolute position
        // if not exists then use (element).offSet() for absolute position

        // var offset = $(element).offset(); // will need to factor in scroll x,y
        // $(element).css({
        //   position: 'absolute'
        // });
        // $(element).css(offset);

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

        // scope.$watch(function () {
        //     return scope.vm.notificationToRemove;
        //   },
        //   function (newVal, oldVal) {
        //     var idx = scope.vm.notifications.indexOf(newVal);
        //     if (idx > -1) {
        //
        //       removedNotifications.push(scope.vm.notifications.splice(idx, 1));
        //     }
        //   })
      }
    };
  }

  // function NotificationCtrl($scope) {
  //
  //   var vm = this;
  //   // vm.notifications
  //   // now we have vm.notifications available because of bindToController
  //   // what will we do in here?
  //   // define functions for modifying the notifications if needed
  //   // and for handling events in the directive
  //   // but couldn't we do that in the directive link function?
  //   // i think so but i want the notification directive to repeat
  //   // over a controller property so I need a controller (I think)
  //   // vm.notificationToRemove;
  //   vm.remove = remove;
  //
  //   function remove(el, notif) {
  //     // set class on element.
  //     // set timeout to remove notif from array
  //     // and el from dom
  //     // vm.notifications.filter(function(val){
  //     //   return val.message === el.message;
  //     // })
  //     var idx = vm.notifications.indexOf(notif);
  //     // if (idx > -1) {
  //     //   vm.notifications.splice(idx, 1);
  //     // }
  //   }
  // }

}(this.angular));
