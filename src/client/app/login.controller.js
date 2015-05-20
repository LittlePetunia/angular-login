(function (angular) {
  'use strict';

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$rootScope', '$state', 'AuthSvc', 'GlobalNotificationSvc'];

  function LoginCtrl($rootScope, $state, AuthSvc, GlobalNotificationSvc) {

    var vm = this;
    // properties
    vm.form = {
      userName: null,
      password: null
    };

    // functions
    vm.login = login;

    activate();

    function activate() {
      if (AuthSvc.isLoggedIn()) {
        $state.go('welcome');
      }
    }

    function login(user) {
      AuthSvc.login(user.userName, user.password)
        .then(function () {
          $state.go('welcome');
        }, function (res) {
          GlobalNotificationSvc.addError(res.data.message);
          console.log(res);
        });
    }
  }

}(this.angular));
