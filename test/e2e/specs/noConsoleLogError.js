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
const shortcuts = require("./shortcuts");

module.exports = {
  "No console error test": function(browser) {
    shortcuts(browser)
      .login()
      .goAndWaitH1("#navbar-utility__settings-link", "Update your settings")
      .goAndWaitH1(
        "#navbar-secondary__change-password-link",
        "Change your password"
      )
      .goAndWaitH1(
        "#navbar-secondary__notification-link",
        "Subscribe to notifications"
      )
      .goAndWaitH1(
        "#navbar-secondary__user-settings-link",
        "Update your settings"
      )
      .goAndWaitH1("#navbar-primary__topics-link", "Topics")
      .goAndWaitH1("#topics__create-topic-btn", "Create a new topic")
      .goAndWaitH1(".btn-cancel", "Topics")
      .go(".btn-edit")
      .goAndWaitH1(".btn-cancel", "Topics")
      .goAndWaitH1("#navbar-primary__components-link", "Components")
      .goAndWaitH1("#navbar-primary__global-status-link", "Global Status")
      .goAndWaitH1("#navbar-primary__metrics-link", "Metrics")
      .goAndWaitH1("#navbar-primary__admin-users-link", "Users")
      .goAndWaitH1("#admin__create-user-btn", "Create a new user")
      .goAndWaitH1(".btn-cancel", "Users")
      .go(".btn-edit")
      .goAndWaitH1(".btn-cancel", "Users")
      .goAndWaitH1("#navbar-secondary__admin-teams-link", "Teams")
      .goAndWaitH1("#admin__create-team-btn", "Create a new team")
      .goAndWaitH1(".btn-cancel", "Teams")
      .go(".btn-edit")
      .goAndWaitH1(".btn-cancel", "Teams")
      .goAndWaitH1("#navbar-secondary__admin-remotecis-link", "Remotecis")
      .goAndWaitH1("#admin__create-remoteci-btn", "Create a new remoteci")
      .goAndWaitH1(".btn-cancel", "Remotecis")
      .go(".btn-edit")
      .goAndWaitH1(".btn-cancel", "Remotecis")
      .goAndWaitH1("#navbar-secondary__admin-products-link", "Products")
      .goAndWaitH1("#admin__create-product-btn", "Create a new product")
      .goAndWaitH1(".btn-cancel", "Products")
      .go(".btn-edit")
      .goAndWaitH1(".btn-cancel", "Products")
      .goAndWaitH1("#navbar-secondary__admin-users-link", "Users");

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

    shortcuts(browser)
      .logout()
      .end();
  }
};
