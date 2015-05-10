(function (angular) {
  'use strict';

  angular
    .module('app')
    .factory('SessionSvc', SessionSvc);

  /*
   * service for
   * holding session info
   */
  SessionSvc.$inject = ['$http', '$q'];

  function SessionSvc($http, $q) {

    var session = {
      id: null
    };

    function create(sessionId) {
      session.id = sessionId;
      return angular.copy(session);
    }

    function clear() {
      session.id = null;
    }

    function get(userInfo) {
      return angular.copy(session);
    }

    return {
      create: create,
      get: get,
      clear: clear
    };
  }
})(this.angular);
