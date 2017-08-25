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

module.exports = {
  "Change password test": function(browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "user_dell")
      .setValue("#inputPassword", "password")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1")
      .click("#menu__settings-link")
      .waitForElementVisible("h1")
      .click('a[ui-sref="auth.password"]')
      .waitForElementVisible("#current_password")
      .setValue("#current_password", "password")
      .setValue("#new_password", "new_password")
      .setValue("#new_password2", "new_password")
      .waitForElementVisible("#changePasswordButton")
      .click("#changePasswordButton")
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "user_dell")
      .setValue("#inputPassword", "new_password")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard")
      .click("#menu__settings-link")
      .waitForElementVisible("h1")
      .click('a[ui-sref="auth.password"]')
      .waitForElementVisible("#current_password")
      .setValue("#current_password", "new_password")
      .setValue("#new_password", "password")
      .setValue("#new_password2", "password")
      .click("#changePasswordButton")
      .waitForElementVisible("#inputUsername");

    browser.end();
  }
};
