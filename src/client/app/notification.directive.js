(function (angular) {
  'use strict';

  angular.module('app')
    .directive('notification', notification);

  notification.$inject = ['NotificationSvc'];

  function notification(NotificationSvc) {

    return {
      restrict: 'E',
      scope: {

      },
      link: function (scope, element, attrs) {

        var notes = NotificationSvc;
        var zIndex = 0;

        scope.$watch(function () {
          return notes.count();
        }, function (newVal, oldVal) {

          if (newVal === 0) {
            return;
          }

          var n = notes.removeAll();
          for (var i = 0; i < n.length; i++) {

            var html = '<div class="alert alert-danger notification" style="z-index: ' + (50 + (++zIndex % 50)) +
              '">' +
              ' <button type="button" class="close" onclick="$(this).parent().addClass(\'removed\')">' +
              '   <span> &times; </span>' +
              ' </button>' +
              // ' <span ng-bind="' + n[i].message + '" >' + '</span> ' +
              ' <span >' + n[i].message + '</span> ' +
              ' </div> ';

            element.prepend(html);
            //scope.$digest();
          }
        });
      }
    };
  }

}(this.angular));
