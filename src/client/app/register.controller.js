(function () {
  'use strict';

  angular.module('app')
    .controller('RegisterCtrl', RegisterCtrl);


  RegisterCtrl.$inject = ['$rootScope'];
  function RegisterCtrl($rootScope) {

    $rootScope.title = 'Register';
    var vm = this;
    vm.user = {};
    vm.showError = false;
    vm.submitUser = submitUser;
    vm.errorMessage = null;

    // functions for collecting form data and submitting new user info
    function submitUser(user) {}

    function clearErrorMessage() {
      vm.errorMessage = null;
    }
  }
}(this.angular));
