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

var assert = require("assert");

module.exports = {
  "Login logout tests": function(browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible("#loginForm")
      .setValue("input[type=text]", "user_dell")
      .setValue("input[type=password]", "password")
      .waitForElementVisible("#loginButton")
      .click("#loginButton")
      .waitForElementVisible("h1")
      .assert.elementNotPresent('a[ui-sref="adminUsers"]')
      .click("#btn-logout")
      .setValue("input[type=text]", "admin_dell")
      .setValue("input[type=password]", "password")
      .waitForElementVisible("#loginForm")
      .click("#loginButton")
      .waitForElementVisible("h1")
      .assert.elementPresent('a[ui-sref="adminUsers"]');

    browser.end();
  }
};
