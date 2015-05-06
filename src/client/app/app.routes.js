(function(angular) {
  'use strict';

  angular
    .module('app')
    .config(routeConfig);


  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/welcome');

    $stateProvider
      .state('welcome', {
        url: '/welcome',
        views: {
          'top-nav': {
            templateUrl: 'app/layout/top-nav.html'
          },
          'main-content': {
            templateUrl: 'app/welcome.html'
              //controller: 'HomeCtrl',
              //controllerAs: 'vm'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          'top-nav': {
            templateUrl: 'app/layout/top-nav.html'
          },
          'main-content': {
            templateUrl: 'app/login.html'
              // controller: 'TodoCtrl',
              // controllerAs: 'vm'
          }
        }
      })
      .state('register', {
        url: '/register',
        views: {
          'top-nav': {
            templateUrl: 'app/layout/top-nav.html'
          },
          'main-content': {
            templateUrl: 'app/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'vm'
          }
        }
      });
  }
})(this.angular);
