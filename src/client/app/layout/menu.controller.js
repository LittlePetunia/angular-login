(function (angular) {
  'use strict';

  angular
    .module('app')
    .controller('MenuCtrl', MenuCtrl);

  MenuCtrl.$inject = ['SessionSvc', 'UserSvc'];

  function MenuCtrl(SessionSvc, UserSvc) {

    var vm = this;
    vm.user = null;

    vm.logOut = logOut;
    //vm.isLoggedIn = isLoggedIn;
    // vm.menu = MenuSvc.getMenu();

    activate();

    function activate() {
      if (SessionSvc.hasSession()) {
        vm.isLoggedIn = true;
        vm.user = UserSvc.get(SessionSvc.get().userId)
          .then(function (resOk) {
              vm.user = resOk.data;
            },
            function (resErr) {
              console.error(resErr);
            });
      }
    }

    // function isLoggedIn() {
    //   return SessionSvc.hasSession();
    // }

    // function getUserInfo() {
    //   if(isLoggedIn()){
    //     return UserSvc.get(SessionSvc).userId;
    //   }
    // }

    function logOut() {
      SessionSvc.clear();
      vm.user = null;
      // vm.isLoggedIn = false;
    }
  }

})(this.angular);
