// Copyright 2015 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

const shortcuts = require("./shortcuts");

module.exports = {
  "Can create and delete a user": function(browser) {
    const login = Date.now();
    shortcuts(browser)
      .login()
      .go("Users")
      .waitForElementVisible("#users-screen__show-modal-button")
      .click("#users-screen__show-modal-button")
      .waitForElementVisible("#user-form__name")
      .clearValue("#user-form__name")
      .setValue("#user-form__name", login)
      .clearValue("#user-form__fullname")
      .setValue("#user-form__fullname", login)
      .clearValue("#user-form__email")
      .setValue("#user-form__email", `${login}@example.org`)
      .clearValue("#user-form__password")
      .setValue("#user-form__password", login)
      .click('select[id="user-form__team"]')
      .waitForElementVisible("option[name='admin']")
      .click("option[name='admin']")
      .click('select[id="user-form__role"]')
      .waitForElementVisible("option[name='User']")
      .click("option[name='User']")
      .waitForElementVisible("#submit-modal-button")
      .click("#submit-modal-button")
      .useXpath()
      .waitForElementPresent(`//tr[td/text()="${login}"]`)
      .useCss()
      .waitForElementVisible(".btn-danger")
      .click(".btn-danger")
      .useXpath()
      .waitForElementVisible(`//button[text()="Yes delete ${login}"]`)
      .click(`//button[text()="Yes delete ${login}"]`)
      .waitForElementNotPresent(`//a[text()="${login}"]`)
      .useCss()
      .end();
  }
};
