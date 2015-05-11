(function (angular) {
  'use strict';

  angular.module('app')
    .controller('RegistrationCtrl', RegistrationCtrl);

  RegistrationCtrl.$inject = ['$rootScope', '$state', '$timeout', 'UserSvc', 'SessionSvc'];

  function RegistrationCtrl($rootScope, $state, $timeout, UserSvc, SessionSvc) {

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
      if (SessionSvc.hasSession()) {
        // already logged in, redirect to welcome page
        $state.go('welcome');
      }
    }

    // functions for collecting form data and submitting new user info
    function submitUser(user) {
      clearUserMessage();
      UserSvc.create(user)
        .success(function (data, status, headers, config) {
          setUserMessage('success', 'User Created! Id: ' + data._id);
          // $state.go('login');
          $timeout(function () {
            setUserMessage('success', 'Logging you in....');
            // $timeout(function () {
            //   $state.go('login');
            // }, 1000);
          }, 1000);

          login({
            userName: user.userName,
            password: user.password
          });
        })
        .error(function (data, status, headers, config) {
          var msg = 'Error creating user: ' + (data ? data.message : '');
          if (data.errors && data.errors.length > 0) {
            msg += ': \n' + data.errors.join('\n');
          }
          setUserMessage('error', msg);
        });
    }

    function login(loginForm) {
      UserSvc.login(loginForm)
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
