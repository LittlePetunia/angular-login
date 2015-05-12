(function (angular) {
  'use strict';

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$rootScope', '$state', '$window', 'UserSvc', 'SessionSvc'];

  function LoginCtrl($rootScope, $state, $window, UserSvc, SessionSvc) {

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
      if ($window.sessionStorage.token) {
        $state.go('welcome');
      }
    }

    function login(loginInfo) {
      UserSvc.login(loginInfo)
        .success(function (data, status, headers, config) {
          $window.sessionStorage.token = data.token;
          $state.go('welcome');
        })
        .error(function (data, status, headers, config) {
          delete $window.sessionStorage.token;
          setUserMessage(vm.userMessageTypes.error, data.message);
          console.log(data, status, headers, config);
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
