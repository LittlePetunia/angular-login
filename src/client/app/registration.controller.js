(function (angular) {
  'use strict';

  angular.module('app')
    .controller('RegistrationCtrl', RegistrationCtrl);

  RegistrationCtrl.$inject = ['$rootScope', '$state', '$timeout', 'UserSvc', 'AuthSvc', 'NotificationSvc'];

  function RegistrationCtrl($rootScope, $state, $timeout, UserSvc, AuthSvc, NotificationSvc) {

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
    vm.notificationTest = notificationTest;

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

    var num = 0;

    function notificationTest() {
      NotificationSvc.add({
        message: 'notification test #' + ++num
      });
    }

    // functions for collecting form data and submitting new user info
    function submitUser(user) {
      clearUserMessage();
      UserSvc.register(user)
        .then(function () {
            return AuthSvc.login(user.userName, user.password);
          },
          function (res) {

            var msg = 'Error creating user: ' + (res.data ? res.data.message : '');
            if (res.data.errors && res.data.errors.length > 0) {
              msg += ': \n' + res.data.errors.join('\n');
            }
            var formattedResponse = {
              data: {
                message: msg
              }
            };
            // formattedResponse.data.message = msg;
            throw formattedResponse;
          })
        .then(function () {
            $state.go('welcome');
          },
          function (res) {
            console.error(res);
            setUserMessage(vm.userMessageTypes.error, res.data.message);
          });

    }

    // function login(loginInfo) {
    //   UserSvc.login(loginInfo)
    //     .then(function () {
    //         return UserSvc.getCurrentUser();
    //       },
    //       function (res) {
    //         // if handlint the success you must handle the error or it is not propogated.
    //         return res;
    //       })
    //     .then(function (res) {
    //         $state.go('welcome');
    //       },
    //       function (res) {
    //         console.error(res);
    //         setUserMessage(vm.userMessageTypes.error, res.data.message);
    //       });
    //
    // }

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
