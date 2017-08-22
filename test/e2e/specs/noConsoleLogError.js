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

const assert = require("assert");

module.exports = {
  "No console error test": function(browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "admin")
      .setValue("#inputPassword", "admin")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard")
      .click('a[ui-sref="auth.components"]')
      .waitForElementVisible(".list-group-item-header")
      .click('a[ui-sref="auth.metrics"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Metrics")
      .click('a[ui-sref="auth.adminUsers"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Users")
      .click('a[ui-sref="auth.adminTeams"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Teams")
      .click('a[ui-sref="auth.adminTopics"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Topics")
      .click('a[ui-sref="auth.adminRemotecis"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Remotecis")
      .click('a[ui-sref="auth.globalStatus"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Global Status")
      .click("#menu__settings-link")
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Update your settings")
      .click('a[ui-sref="auth.password"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Change your password")
      .click('a[ui-sref="auth.notification"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Subscribe to notifications")
      .click('a[ui-sref="auth.jobs"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard");

    browser.getLog(function(logs) {
      logs = logs.filter(function(log) {
        return (
          ["DEBUG", "INFO", "WARNING"].indexOf(log.level) === -1 &&
          log.source !== "network"
        );
      });
      assert(
        logs.length === 0,
        "Console log error(s):\n" + JSON.stringify(logs, null, 2)
      );
    });

    browser.end();
  }
};
