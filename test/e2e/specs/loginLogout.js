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
      .url("http://localhost:8000")
      .waitForElementVisible("body", 10000)
      .setValue("input[type=text]", "user_dell")
      .setValue("input[type=password]", "password")
      .waitForElementVisible("button[type=submit]", 10000)
      .click("button[type=submit]")
      .waitForElementVisible("h1", 10000)
      .assert.elementNotPresent('a[ui-sref="adminUsers"]')
      .click("#btn-logout")
      .setValue("input[type=text]", "admin_dell")
      .setValue("input[type=password]", "password")
      .waitForElementVisible("button[type=submit]", 10000)
      .click("button[type=submit]")
      .waitForElementVisible("h1", 10000)
      .assert.elementPresent('a[ui-sref="adminUsers"]');

    browser.getLog(function(logs) {
      assert(
        logs.length === 0,
        "Console log error(s):\n" + JSON.stringify(logs, null, 2)
      );
    });

    browser.end();
  }
};
