// Copyright 2017 Red Hat, Inc.
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

const assert = require("assert");

module.exports = {
  "Login logout test": function(browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "user_dell")
      .setValue("#inputPassword", "password")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard")
      .assert.elementNotPresent('a[ui-sref="auth.adminUsers"]')
      .click("#menu__logout-link")
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "admin_dell")
      .setValue("#inputPassword", "password")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard")
      .assert.elementPresent('a[ui-sref="auth.adminUsers"]');

    browser.end();
  }
};
