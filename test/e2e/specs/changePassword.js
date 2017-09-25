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
  "Change password for user_dell": function(browser) {
    shortcuts(browser)
      .login("user_dell", "user_dell")
      .go("changePassword")
      .changePassword("user_dell", "new_password")
      .pause(3000)
      .end();
  },
  "Reset user_dell password": function(browser) {
    shortcuts(browser)
      .login("user_dell", "new_password")
      .go("changePassword")
      .changePassword("new_password", "user_dell")
      .pause(3000)
      .end();
  },
  "Test user_dell old password": function(browser) {
    shortcuts(browser)
      .login("user_dell", "user_dell")
      .go("jobs")
      .end();
  }
};
