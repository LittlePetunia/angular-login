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

    function login(userForm) {
      UserSvc.login(userForm)
        .then(
          function (session) {
            // add user to root scope?
            SessionSvc.create(session._id);
            // redirect to welcome page for now
            $state.go('welcome');
          },
          function (err) {
            setUserMessage(vm.userMessageTypes.error, err.data.message);
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
