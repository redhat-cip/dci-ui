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

module.exports = function(browser) {
  browser.login = function(user = "admin", password = "admin") {
    this.url(browser.launch_url)
      .pause(250)
      .waitForElementVisible("#loginToggleFormLink")
      .click("#loginToggleFormLink")
      .waitForElementVisible("#inputUsername")
      .clearValue("#inputUsername")
      .setValue("#inputUsername", user)
      .waitForElementVisible("#inputPassword")
      .clearValue("#inputPassword")
      .setValue("#inputPassword", password)
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("job-summary")
      .pause(250)
      .waitForElementVisible("h1")
      .assert.containsText("h1", "Dashboard");
    return this;
  };

  browser.logout = function() {
    this.waitForElementVisible("#navbar-utility__logout-link")
      .click("#navbar-utility__logout-link")
      .pause(1000)
      .refresh();
    return this;
  };

  browser.changePassword = function(currentPassword, newPassword) {
    this.waitForElementVisible("#new_password2")
      .clearValue("#current_password")
      .clearValue("#new_password")
      .clearValue("#new_password2")
      .setValue("#current_password", currentPassword)
      .setValue("#new_password", newPassword)
      .setValue("#new_password2", newPassword)
      .waitForElementVisible("button#changePasswordButton")
      .click("button#changePasswordButton");
    return this;
  };

  browser.waitForXpathElementVisible = function(element) {
    this.useXpath()
      .waitForElementVisible(element)
      .useCss();
    return this;
  };

  browser.checkLogs = function(page) {
    this.getLog(logs => {
      const formattedLogs = JSON.stringify(logs, null, 2);
      assert(
        logs.length === 0,
        `Console log error in ${page} page: ${formattedLogs}`
      );
    });
    return this;
  };

  browser.clearLogs = function() {
    this.getLog(() => {});
    return this;
  };

  browser.go = function(page) {
    switch (page) {
      case "jobs":
        return this.click(
          "#navbar-primary__jobs-link"
        ).waitForXpathElementVisible(
          "//div[normalize-space(text())='RH7-RHOS-12.0 2016-11-12.1']"
        );
      case "globalStatus":
        return this.click(
          "#navbar-primary__global-status-link"
        ).waitForXpathElementVisible(
          "//span[normalize-space(text())='(RH7-RHOS-11.0 2016-11-11.1)']"
        );
      case "topics":
        return this.click(
          "#navbar-primary__topics-link"
        ).waitForXpathElementVisible("//a[normalize-space(text())='OSP10']");
      case "createTopic":
        return this.click("#navbar-primary__topics-link")
          .waitForXpathElementVisible("//a[normalize-space(text())='OSP10']")
          .click("#topics__create-topic-btn")
          .waitForElementVisible("button#createButton");
      case "components":
        return this.click(
          "#navbar-primary__components-link"
        ).waitForXpathElementVisible(
          "//span[normalize-space(text())='RH7-RHOS-10.0 2016-11-12.1']"
        );
      case "Remotecis":
        return this.click(
          "#navbar-primary__remotecis-link"
        ).waitForXpathElementVisible(
          "//a[normalize-space(text())='Remoteci OpenStack']"
        );
      case "Feeders":
        return this.click(
          "#navbar-primary__remotecis-link"
        ).waitForXpathElementVisible(
          "//a[normalize-space(text())='Remoteci OpenStack']"
        );
      case "Products":
        return this.click(
          "#navbar-primary__products-link"
        ).waitForXpathElementVisible("//a[normalize-space(text())='Ansible']");
      case "adminUsers":
        return this.click(
          "#navbar-primary__admin-users-link"
        ).waitForXpathElementVisible("//a[normalize-space(text())='user_hp']");
      case "createUser":
        return this.click("#navbar-primary__admin-users-link")
          .waitForXpathElementVisible("//a[normalize-space(text())='user_hp']")
          .click("#admin__create-user-btn")
          .waitForElementVisible("button#createButton");
      case "adminTeams":
        return this.click(
          "#navbar-primary__admin-teams-link"
        ).waitForXpathElementVisible(
          "//a[normalize-space(text())='OpenStack']"
        );
      case "settings":
        return this.click(
          "#navbar-primary__settings-link"
        ).waitForElementVisible("button#changeSettingsButton");
      case "changePassword":
        return this.click(
          "#navbar-primary__password-link"
        ).waitForElementVisible("button#changePasswordButton");
      case "notification":
        return this.click(
          "#navbar-primary__notification-link"
        ).waitForElementVisible("i.fa-plus");
    }
    return this;
  };

  return browser;
};
