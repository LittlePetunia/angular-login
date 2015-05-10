(function (angular) {
  'use strict';

  angular
  // .module('app', ['ui.router', 'ngResource', 'datetimepicker']);
    .module('app', ['ui.router']);

  angular.module('app')
    .config(function ($provide, $httpProvider) {
      $provide.factory('ErrorInterceptor', function ($q) {
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

      $httpProvider.interceptors.push('ErrorInterceptor');
    });

})(this.angular);
