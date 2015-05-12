(function (angular) {
  'use strict';

  angular
  // .module('app', ['ui.router', 'ngResource', 'datetimepicker']);
    .module('app', ['ui.router']);

  angular.module('app')
    .factory('authInterceptor', function ($q, $window) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            console.log('requesting with token');
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          } else {
            console.log('requesting without token');
          }
          return config;
        },
        response: function (response) {
          if (response.status === 401) {
            // handle the case where the user is not authenticated
            console.error('Not authorized: ' + response);
          }
          return response || $q.when(response);
        }
      };
    });

  angular.module('app')
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    });

  angular.module('app')
    .factory('errorInterceptor', function ($q) {
      return {
        responseError: function (res) {
          console.log(res);
          if (res.status === 0 && res.data == null) {
            res.data = {};
            res.data.message = 'The site is not available right now.';
          }

          return $q.reject(res);
        }
      };
    });

  angular.module('app')
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('errorInterceptor');
    });

})(this.angular);
