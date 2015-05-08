'use strict';

/* global protractor */
var path = require('path');
var Q = require('q');
// var moment = require('moment');
var RegistrationPage = require('./registration.page.js');
var request = require('superagent');

var usersRootUri = 'localhost:3000/api/users';

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

function hasClass(element, cls) {
  return element.getAttribute('class').then(function (classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
}

describe('Registration form', function () {

  var page;
  beforeEach(function () {
    page = new RegistrationPage();
  });

  it('should not create a new user when form cancel button clicked', function () {

    // browser.pause();
    expect(hasClass(page.successMessageDiv, 'ng-hide')).toEqual(true);
    // browser.get('/');
    // $('a[ui-sref="register"]').click();
    //
    // // browser.get('/');
    // // var ptor = protractor.getInstance();
    // var url = browser.getCurrentUrl();
    // expect(url).toContain('/register');

    page.userName = 'testUser11';
    page.password = 'password11';
    page.email = 'testuser11@mail.com';
    page.firstName = 'test';
    page.lastName = 'user';
    expect(page.userName.getText()).toEqual('testUser11');

    //page.btnSubmit.click();

    expect(hasClass(page.successMessageDiv, 'ng-hide')).toEqual(false);
  });

  xit('should create a new user when form submit button clicked', function () {
    expect(true).toEqual(true);
  });

  xit('should show validation message if username length is less than 8 characters', function () {
    expect(true).toEqual(true);
  });

  xit('should show validation message if password is less than 8 characters', function () {
    expect(true).toEqual(true);
  });

  xit('should redirect to welcome screen after successful form submission', function () {
    expect(true).toEqual(true);
  });

});
