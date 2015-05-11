(function (angular) {
  'use strict';

  angular.module('app')
    .controller('WelcomeCtrl', WelcomeCtrl);

  WelcomeCtrl.$inject = ['SessionSvc', 'UserSvc'];

  function WelcomeCtrl(SessionSvc, UserSvc) {

    var vm = this;
    vm.user = null;

    activate();

    function activate() {
      if (SessionSvc.hasSession()) {
        UserSvc.get(SessionSvc.get().userId)
          .then(function (resOk) {
            vm.user = resOk.data;
          }, function (resErr) {
            console.error(resErr);
          })
      }
    }
  }

}(this.angular));
