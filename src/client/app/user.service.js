(function (angular) {
  'use strict';

  angular
    .module('app')
    .factory('UserSvc', UserSvc);

  /*
   * service for
   * creating a new user
   * getting user info
   * authenticating a user
   * checking user authorization to resources
   */
  UserSvc.$inject = ['$http', '$q'];

  function UserSvc($http, $q) {

    var userUrl = '/api/users';
    var loginUrl = '/api/login';

    function create(user) {
      return $http.post(userUrl, user);
    }

    function login(userInfo) {
      return $http.post(loginUrl, userInfo);
    }

    return {
      create: create,
      login: login
    }
  }
})(this.angular);
