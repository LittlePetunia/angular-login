(function (angular) {
  'use strict';

  angular
    .module('app')
    .factory('SessionSvc', SessionSvc);

  /*
   * service for
   * holding session info
   */
  // SessionSvc.$inject = [];

  function SessionSvc() {

    var session = {
      id: null,
      userId: null
    };

    function create(id, userId) {
      if (id == null || userId == null) {
        throw new Error('Session id and userId must not be null');
      }
      session.id = id;
      session.userId = userId;
      return angular.copy(session);
    }

    function clear() {
      session.id = null;
      session.userId = null;
    }

    function get() {
      return angular.copy(session);
    }

    function hasSession() {
      return session.id != null;
    }

    return {
      create: create,
      hasSession: hasSession,
      get: get,
      clear: clear
    };
  }
})(this.angular);
