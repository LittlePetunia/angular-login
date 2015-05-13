(function (angular) {
  'use strict';

  angular.module('app')
    .controller('RegistrationCtrl', RegistrationCtrl);

  RegistrationCtrl.$inject = ['$rootScope', '$state', '$timeout', 'UserSvc', 'AuthSvc'];

  function RegistrationCtrl($rootScope, $state, $timeout, UserSvc, AuthSvc) {

    $rootScope.title = 'Register';
    var vm = this;
    // properties
    vm.user = {};
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
    vm.submitUser = submitUser;
    vm.clearUserMessage = clearUserMessage;

    var test = true;
    // test = false;
    if (test) {
      vm.form = {};
      vm.form.userName = 'testUser1234';
      vm.form.password = 'testUser1234';
      vm.form.email = 'testUser1234@mail.com';
      vm.form.firstName = 'test';
      vm.form.lastName = 'user';
    }

    // activation
    activate();

    function activate() {
      if (AuthSvc.isLoggedIn()) {
        $state.go('welcome');
      }
    }

    // functions for collecting form data and submitting new user info
    function submitUser(user) {
      clearUserMessage();
      UserSvc.register(user)
        .then(function () {
          return AuthSvc.login({
            userName: user.userName,
            password: user.password
          });
        }, function (res) {
          var msg = 'Error creating user: ' + (res.data ? res.data.message : '');
          if (res.data.errors && res.data.errors.length > 0) {
            msg += ': \n' + res.data.errors.join('\n');
          }
          setUserMessage('error', msg);
        });
    }

    function login(loginInfo) {
      UserSvc.login(loginInfo)
        .then(function () {
          return UserSvc.getCurrentUser();
        }, function (res) {
          // TODO: is this needed? if i don't handle the error here it will still be handled later right?
          // setUserMessage(vm.userMessageTypes.error, res.data.message);
          return res;
        })
        .then(function (res) {
          $state.go('welcome');
        }, function (res) {
          console.error(res);
          setUserMessage(vm.userMessageTypes.error, res.data.message);
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
