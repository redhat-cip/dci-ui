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

const shortcuts = require("./shortcuts");

module.exports = {
  "No console error test": function(browser) {
    shortcuts(browser)
      .login()
      .clearLogs()
      .go("settings")
      .checkLogs("Settings")
      .go("changePassword")
      .checkLogs("Change password")
      .go("notification")
      .checkLogs("Notification")
      .go("topics")
      .checkLogs("Topics")
      .go("components")
      .checkLogs("Components")
      .go("globalStatus")
      .checkLogs("Global Status")
      .go("metrics")
      .checkLogs("Metrics")
      .go("adminUsers")
      .checkLogs("Admin Users")
      .go("adminTeams")
      .checkLogs("Admin Teams")
      .go("adminRemotecis")
      .checkLogs("Admin Remotecis")
      .go("adminFeeders")
      .checkLogs("Admin Feeders")
      .go("adminProducts")
      .checkLogs("Admin Products")
      .logout()
      .end();
  }
};
