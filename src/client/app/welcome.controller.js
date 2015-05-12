(function (angular) {
  'use strict';

  angular.module('app')
    .controller('WelcomeCtrl', WelcomeCtrl);

  WelcomeCtrl.$inject = ['SessionSvc', 'UserSvc', '$window'];

  function WelcomeCtrl(SessionSvc, UserSvc, $window) {

    var vm = this;
    vm.user = null;

    activate();

    function activate() {
      if ($window.sessionStorage.token) {
        UserSvc.getMe()
          .success(function (data, status, headers, config) {
            vm.user = data;
          })
          .error(function (err) {
            console.error(err);
          });
      }
    }
  }

}(this.angular));
