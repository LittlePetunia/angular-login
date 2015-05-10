(function () {
  'use strict';

  angular.module('app')
    .controller('RegistrationCtrl', RegistrationCtrl);

  RegistrationCtrl.$inject = ['$rootScope', '$state', '$timeout', 'UserSvc'];

  function RegistrationCtrl($rootScope, $state, $timeout, UserSvc) {

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
      // vm.user.userName = 'testUser';
      // vm.user.password = 'testPassword';
      // vm.user.email = 'test@mail.com';
      // vm.user.firstName = 'test';
      // vm.user.lastName = 'user';
      vm.form = {};
      vm.form.userName = 'testUser1234';
      vm.form.password = 'testUser1234';
      vm.form.email = 'testUser1234@mail.com';
      vm.form.firstName = 'test';
      vm.form.lastName = 'form';
    }

    // functions for collecting form data and submitting new user info
    function submitUser(user) {
      clearUserMessage();
      UserSvc.create(user)
        .success(function (data, status, headers, config) {
          setUserMessage('success', 'User Created! Id: ' + data._id);
          // $state.go('login');
          $timeout(function () {
            setUserMessage('success', 'Redirecting to login page....');
            $timeout(function () {
              $state.go('login');
            }, 1000);
          }, 1000);
        })
        .error(function (data, status, headers, config) {
          var msg = 'Error creating user: ' + (data ? data.message : '');
          if (data.errors && data.errors.length > 0) {
            msg += ': \n' + data.errors.join('\n');
          }
          setUserMessage('error', msg);
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
