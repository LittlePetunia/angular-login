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

function getUsers(userId) {
  var deferred = Q.defer();
  request
    .get(urlHelper.get(userId))
    .end(function (err, res) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}

function deleteUser(userId) {
  var deferred = Q.defer();
  request
    .del(urlHelper.delete(userId))
    .end(function (err, res) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}

describe('Registration form', function () {

  // get existing items
  var dbItems;
  beforeEach(function (done) {
    getUsers()
      .then(function (res) {
        dbItems = res.body;
        done();
      }, done);
  });

  // delete them
  beforeEach(function (done) {
    if (dbItems == null || dbItems.length === 0) {
      done();
    }
    var promises = dbItems.map(function (item) {
      return deleteUser(item._id);
    });

    Q.all(promises)
      .then(function () {
        done();
      }, done);
  });

  var page;
  var ptor;
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
          done();
        } else {
          done();
        }
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
    // expect($$('#userMessage.alert-success').first().isDisplayed()).toEqual(true);

    browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          //console.log(url);
          // return url.indexOf('/login') > -1;
          return /\/login$/.test(url);
        });
      }, 2000)
      .then(function () {
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

  it('should redirect to login screen after successful user creation', function () {
    page.formClear();
    page.userName = 'testUser22';
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';

    page.btnSubmit.click();

    browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          //console.log(url);
          return /\/login$/.test(url);
        });
      }, 2000)
      .then(function () {
        expect(true).toEqual(true);
      });
  });

});
