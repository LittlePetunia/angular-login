(function (angular) {
  'use strict';

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$rootScope', '$state', 'UserSvc', 'SessionSvc'];

  function LoginCtrl($rootScope, $state, UserSvc, SessionSvc) {

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
      if (SessionSvc.hasSession()) {
        // already logged in, redirect to welcome page
        $state.go('welcome');
      }
    }

    function login(userForm) {
      UserSvc.login(userForm)
        .then(
          function (resOk) {
            // add user to root scope?
            SessionSvc.create(resOk.data._id, resOk.data.userId);
            // redirect to welcome page for now
            $state.go('welcome');
          },
          function (resErr) {
            setUserMessage(vm.userMessageTypes.error, resErr.data.message);
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
