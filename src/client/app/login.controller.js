(function (angular) {
  'use strict';

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$rootScope', 'UserSvc'];

  function LoginCtrl($rootScope, UserSvc) {

    var vm = this;
    // properties
    vm.form = {
      userName: null,
      password: null
    };
    // functions
    vm.login = login;

    function login(userForm) {
      UserSvc.login(userForm)
        .then(function (user) {
            // add user to root scope?
            // redirect to welcome page for now
          },
          function (err) {
            // render error details
          });
    }

  }

}(this.angular));
