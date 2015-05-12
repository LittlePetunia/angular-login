(function (angular) {
  'use strict';

  angular
    .module('app')
    .controller('MenuCtrl', MenuCtrl);

  MenuCtrl.$inject = ['$window', 'SessionSvc', 'UserSvc'];

  function MenuCtrl($window, SessionSvc, UserSvc) {

    var vm = this;
    vm.user = null;

    vm.logOut = logOut;
    //vm.isLoggedIn = isLoggedIn;
    // vm.menu = MenuSvc.getMenu();

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

    // function isLoggedIn() {
    //   return SessionSvc.hasSession();
    // }

    // function getUserInfo() {
    //   if(isLoggedIn()){
    //     return UserSvc.get(SessionSvc).userId;
    //   }
    // }

    function logOut() {
      delete $window.sessionStorage.token;
      vm.user = null;
      // vm.isLoggedIn = false;
    }
  }

})(this.angular);
