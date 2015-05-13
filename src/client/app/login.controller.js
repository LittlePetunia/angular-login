(function (angular) {
  'use strict';

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$rootScope', '$state', 'AuthSvc'];

  function LoginCtrl($rootScope, $state, AuthSvc) {

    var vm = this;
    // properties
    vm.form = {
      userName: null,
      password: null
    };
    vm.userMessageTypes = {
      error: 'error',
      success: 'success'
    };
    vm.userMessage = {
      message: null,
      type: null,
      show: false
    };

    // functions
    vm.login = login;
    vm.clearUserMessage = clearUserMessage;

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
          setUserMessage(vm.userMessageTypes.error, res.data.message);
          console.log(res);
        });
    }

    function setUserMessage(type, message) {
      vm.userMessage.message = message;
      vm.userMessage.type = type;
      vm.userMessage.show = true;
    }

    function clearUserMessage() {
      vm.userMessage.message = null;
      vm.userMessage.type = null;
      vm.userMessage.show = false;
    }

  }

}(this.angular));
