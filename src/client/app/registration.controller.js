(function () {
  'use strict';

  angular.module('app')
    .controller('RegistrationCtrl', RegistrationCtrl);

  RegistrationCtrl.$inject = ['$rootScope', 'UserSvc'];

  function RegistrationCtrl($rootScope, UserSvc) {

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
    }

    // functions
    vm.submitUser = submitUser;
    vm.clearUserMessage = clearUserMessage;

    var test = true;
    if (test) {
      // vm.user.userName = 'testUser';
      // vm.user.password = 'testPassword';
      // vm.user.email = 'test@mail.com';
      // vm.user.firstName = 'test';
      // vm.user.lastName = 'user';
      vm.form = {};
      vm.form.userName = 'testUser';
      vm.form.password = 'testPassword';
      vm.form.email = 'test@mail.com';
      vm.form.firstName = 'test';
      vm.form.lastName = 'form';
    }

    // functions for collecting form data and submitting new user info
    function submitUser(user) {
      clearUserMessage();
      UserSvc.create(user)
        .success(function (data, status, headers, config) {
          setUserMessage('success', 'User Created! Id: ' + data._id);
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
