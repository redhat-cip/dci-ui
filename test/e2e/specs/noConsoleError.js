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
  "No console error tests": function(browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible("#loginForm")
      .waitForElementVisible("input[type=text]")
      .setValue("input[type=text]", "admin")
      .waitForElementVisible("input[type=password]")
      .setValue("input[type=password]", "admin")
      .waitForElementVisible("#loginButton")
      .click("#loginButton")
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard")
      .click('a[ui-sref="jobdefs"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Job Definitions")
      .click('a[ui-sref="topics"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Topics")
      .click('a[ui-sref="logs"]')
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Logs")
      .click('a[ui-sref="adminUsers"]')
      .waitForElementVisible(".table-users")
      .assert.containsText("h1", "Users")
      .click('a[ui-sref="adminTeams"]')
      .waitForElementVisible(".table-teams")
      .assert.containsText("h1", "Teams")
      .click('a[ui-sref="adminTopics"]')
      .waitForElementVisible(".table-topics")
      .assert.containsText("h1", "Topics")
      .click('a[ui-sref="adminRemotecis"]')
      .waitForElementVisible(".table-remotecis")
      .assert.containsText("h1", "Remote CIs")
      .click('a[ui-sref="adminAudits"]')
      .waitForElementVisible(".table-audits")
      .assert.containsText("h1", "Audits")
      .click('a[ui-sref="globalStatus"]')
      .waitForElementVisible("global-status")
      .assert.containsText("h1", "Global Status");

    browser.getLog(function(logs) {
      logs = logs.filter(function(log) {
        return ["DEBUG", "INFO", "WARNING"].indexOf(log.level) === -1;
      });
      assert(
        logs.length === 0,
        "Console log error(s):\n" + JSON.stringify(logs, null, 2)
      );
    });

    browser.end();
  }
};
