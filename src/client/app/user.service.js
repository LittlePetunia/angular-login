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

    function create(user) {
      // $http.post(userUrl, user)
      //   .success(function(data, status, headers, config){
      //      var deferred = $q.defer();
      //      deferred.resolve(data);
      //      return deferred.promise;
      //   })
      //   .error(function(data, status, headers, config){
      //     // user might already exist so we have to check for that case
      //     // and return a meaningfull error message
      //     var deferred = $q.defer();
      //     deferred.reject(data);
      //     return deferred.promise;
      //   })
      return $http.post(userUrl, user);

      /*
        error cases:

        errors: "[]"
        message: "insertDocument :: caused by :: 11000 E11000 duplicate key error index: login_test.users.$email_1  dup key: { : "test@mail.com" }"
        name: "MongoError"

        errors: "[]"
        message: "insertDocument :: caused by :: 11000 E11000 duplicate key error index: login_test.users.$userName_1  dup key: { : "testUser2" }"
        name: "MongoError"



        errors: "{"email":{"properties":{"type":"required","message":"{PATH} is required","path":"email"},"message":"email is required","name":"ValidatorError","kind":"required","path":"email"}}"
        message: "User validation failed"
        name: "ValidationError"

        errors: "{"firstName":{"properties":{"type":"required","message":"{PATH} is required","path":"firstName"},"message":"firstName is required","name":"ValidatorError","kind":"required","path":"firstName"}}"
        message: "User validation failed"
        name: "ValidationError"

        errors: "{"lastName":{"properties":{"type":"required","message":"{PATH} is required","path":"lastName"},"message":"lastName is required","name":"ValidatorError","kind":"required","path":"lastName"}}"
        message: "User validation failed"
        name: "ValidationError"

        errors: "{"password":{"properties":{"type":"required","message":"{PATH} is required","path":"password"},"message":"password is required","name":"ValidatorError","kind":"required","path":"password"}}"
        message: "User validation failed"
        name: "ValidationError"

        {
           "firstName":{
              "properties":{
                 "type":"required",
                 "message":"{PATH} is required",
                 "path":"firstName"
              },
              "message":"firstName is required",
              "name":"ValidatorError",
              "kind":"required",
              "path":"firstName"
           }
        }

      */
    }

    return {
      create: create
    }
  }
})(this.angular);
