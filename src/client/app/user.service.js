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
    var loginUrl = '/authenticate';

    function create(user) {
      return $http.post(userUrl, user);
    }

    function login(userInfo) {
      return $http.post(loginUrl, userInfo);
    }

    function get(userId) {
      return $http.get(userUrl + '/' + userId);
    }

    function getMe() {
      return $http.get(userUrl + '/' + 'me');
    }

    return {
      create: create,
      get: get,
      getMe: getMe,
      login: login
    }
  }
})(this.angular);
