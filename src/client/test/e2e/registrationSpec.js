'use strict';

/* global protractor */
/* global $$ */
var path = require('path');
var Q = require('q');
// var moment = require('moment');
var RegistrationPage = require('./registration.page.js');
var request = require('superagent');
var usersRootUri = 'localhost:3000/api/users';

// console.log(JSON.stringify(protractor));
var fakeUserId = '5536a74e354d000000000000';

var urlHelper = {
  login: function () {
    return 'localhost:3000/authenticate';
  },
  get: function (userId) {
    if (userId) {
      return path.join(usersRootUri, userId.toString());
    }
    return path.join(usersRootUri);
  },
  post: function () {
    return path.join(usersRootUri);
  },
  put: function (userId) {
    return path.join(usersRootUri, userId.toString());
  },
  delete: function (userId) {
    return path.join(usersRootUri, userId.toString());
  }
};

// function hasClass(element, cls) {
//   return element.getAttribute('class').then(function (classes) {
//     return classes.split(' ').indexOf(cls) !== -1;
//   });
// }

function create(user) {
  var deferred = Q.defer();
  request
    .post(urlHelper.post())
    .send(user)
    .end(function (err, res) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}

function login(user) {
  var deferred = Q.defer();
  request
    .post(urlHelper.login())
    .send({
      userName: user.userName,
      password: user.password
    })
    .end(function (err, res) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}

function getUsers(userId, token) {
  var deferred = Q.defer();
  request
    .get(urlHelper.get(userId))
    .set('Authorization', 'Bearer ' + token)
    .end(function (err, res) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}

function deleteUser(userId, token) {
  var deferred = Q.defer();
  request
    .del(urlHelper.delete(userId))
    .set('Authorization', 'Bearer ' + token)
    .end(function (err, res) {
      if (err) {
        console.log('error deleting user: ' + userId);
        console.log(err);
        deferred.reject(new Error(err));
      } else {
        //console.log('deleted user: ' + userId);
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}

describe('Registration form', function () {

  // get existing items
  var dbItems;
  var token;
  var startUsersCount = 0;

  var suffix = Math.floor(Math.random() * 1000);

  var tokenUser = {};
  tokenUser.userName = 'testUser' + suffix;
  tokenUser.password = 'password11';
  tokenUser.email = tokenUser.userName + '@mail.com';
  tokenUser.firstName = 'test';
  tokenUser.lastName = 'user';

  // create user so i can get token for him.
  // then delete all users
  beforeAll(function (done) {
    create(tokenUser)
      .then(function (res) {
        return login(tokenUser);
      })
      .then(function (res) {
        token = res.body.token;
      })
      .then(function (res) {
        done();
      }, function (err) {
        console.log(err);
        done(err);
      });
  });

  // create user so i can get token for him.
  // then delete all users
  beforeEach(function (done) {
    getUsers(null, token)
      .then(function (res) {
        if (res.body.length > 0) {
          var promises = res.body.map(function (item) {
            return deleteUser(item._id, token);
          });

          return Q.all(promises);
        } else {
          var deferred = Q.defer();
          deferred.resolve(res);
          return deferred.promise;
        }
      })
      .then(function (res) {
        done();
      }, function (err) {
        console.log(err);
        done(err);
      });
  });

  var page;
  beforeEach(function () {
    page = new RegistrationPage();
  });

  it('should not have validation errors if all fields are valid', function () {

    page.formClear();
    page.userName = 'testUser11';
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    expect(element.all(by.css('#userForm.ng-invalid')).count()).toEqual(0);
  });

  it('should have validation errors if username field is too short', function () {

    page.formClear();
    page.userName = 'testUse'; // 7 chars
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    expect($$('#userForm.ng-invalid').count()).toEqual(1);

  });

  it('should have validation errors if password field is too short', function () {

    page.formClear();
    page.userName = 'testUser11';
    page.password = 'passwor'; // 7 chars
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    expect($$('#userForm.ng-invalid').count()).toEqual(1);

  });

  it('should have validation errors if email field is invalid', function () {

    page.formClear();
    page.userName = 'testUser11';
    page.password = 'password11';
    page.firstName = 'test';
    page.lastName = 'user';

    page.email = 'testuser11mail.com';
    expect($$('#userForm.ng-invalid').count()).toEqual(1);

    page.email = 'testuser11@mailcom.';
    expect($$('#userForm.ng-invalid').count()).toEqual(1);

    page.email = '@testuser11mail.com';
    expect($$('#userForm.ng-invalid').count()).toEqual(1);

  });

  it('should have validation errors if firstName field is empty', function () {

    page.formClear();
    page.userName = 'testUser11';
    page.password = 'passwor'; // 7 chars
    page.email = 'testuser11@mail.com';
    // page.firstName = 'test';
    page.lastName = 'user';

    expect($$('#userForm.ng-invalid').count()).toEqual(1);

  });

  it('should have validation errors if lastName field is empty', function () {

    page.formClear();
    page.userName = 'testUser11';
    page.password = 'passwor'; // 7 chars
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    // page.lastName = 'user';

    expect($$('#userForm.ng-invalid').count()).toEqual(1);
  });

  it('should show success popup when user is successfully submitted', function (done) {

    expect(page.userMessageDiv.isDisplayed()).toEqual(false);

    page.formClear();
    page.userName = 'testUser22';
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    $$('#userForm.ng-valid')
      .count()
      .then(function (val) {
        expect(val).toEqual(1);
        if (val === 0) {
          page.btnSubmit.click();
          expect($$('#userMessage.alert-success').first().isDisplayed()).toEqual(true);
        }
      })
      .then(function () {
        done();
      }, function (err) {
        console.log(err);
        done(err);
      });
  });

  it('should show error popup when user submission fails because of duplicate username', function () {

    page.formClear();
    page.userName = 'testUser22';
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    page.btnSubmit.click();
    expect($$('#userMessage.alert-danger').count()).toEqual(0);

    browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          // console.log(url);
          // return url.indexOf('/login') > -1;
          return /\/welcome$/.test(url);
        });
      }, 2000)
      .then(function () {
        element(by.linkText('Logout')).click();
        page = new RegistrationPage(); // this will redirect us back to the registration page
        page.formClear();
        page.userName = 'testUser22';
        page.password = 'password11';
        page.email = 'testuser11@mail.com';
        page.firstName = 'test';
        page.lastName = 'user';

        page.btnSubmit.click();
        expect($$('#userMessage.alert-danger').first().isDisplayed()).toEqual(true);
      });
  });

  it('should login and redirect to welcome screen after successful user creation', function () {
    page.formClear();
    page.userName = 'testUser22';
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    page.btnSubmit.click();

    browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return /\/welcome$/.test(url);
        });
      }, 2000)
      .then(function () {
        expect(element(by.linkText('testUser22')).isPresent()).toEqual(true);
      });
  });

});
