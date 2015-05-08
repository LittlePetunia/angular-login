'use strict';

module.exports = RegistrationPage;

function RegistrationPage() {

  browser.get('/#/register');
}

RegistrationPage.prototype = Object.create({}, {

  userName: getSetById('userName'),
  password: getSetById('password'),
  email: getSetById('email'),
  firstName: getSetById('firstName'),
  lastName: getSetById('lastName'),

  btnSubmit: getById('btnSubmit'),

  successMessageDiv: getById('successMessage'),
  successMessageCloseButton: getById('btnSuccessMessageClose'),
  errorMessage: getById('errorMessage'),
  errorMessageCloseButton: getById('btnErrorMessageClose')

});

function getSetById(id) {
  return {
    get: function () {
      return element(by.id(id));
    },
    set: function (val) {
      element(by.id(id)).sendKeys(val);
    }
  };
}

function getById(id) {
  return {
    get: function () {
      return element(by.id(id));
    }
  };
}

function getByCss(css) {
  return {
    get: function () {
      return $(css);
    }
  };
}

function getByButtonText(text) {
  return {
    get: function () {
      return element(by.buttonText(text));
    }
  };
}
