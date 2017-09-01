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

module.exports = {
  "Can cancel edit pages": function(browser) {
    function editPageTestCancel(browser, menuSelector, h1Text) {
      browser
        .waitForElementVisible(menuSelector)
        .click(menuSelector)
        .waitForElementVisible("table a:last-child")
        .click("table a:last-child")
        .useXpath()
        .waitForElementVisible("//*[contains(text(), 'Cancel')]")
        .click("//*[contains(text(), 'Cancel')]")
        .waitForElementVisible(
          "//h1[starts-with(normalize-space(.),'" + h1Text + "')]"
        )
        .useCss();
    }

    browser
      .url(browser.launch_url)
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "admin")
      .setValue("#inputPassword", "admin")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1");

    editPageTestCancel(browser, 'a[ui-sref="auth.adminUsers"]', "Users");
    editPageTestCancel(browser, 'a[ui-sref="auth.adminTeams"]', "Teams");
    editPageTestCancel(browser, 'a[ui-sref="auth.adminTopics"]', "Topics");
    editPageTestCancel(
      browser,
      'a[ui-sref="auth.adminRemotecis"]',
      "Remotecis"
    );
    editPageTestCancel(browser, 'a[ui-sref="auth.adminProducts"]', "Products");

    browser.end();
  },
  "Can cancel creation pages": function(browser) {
    function createPageTestCancel(
      browser,
      menuSelector,
      buttonSelector,
      h1Text
    ) {
      browser
        .waitForElementVisible(menuSelector)
        .click(menuSelector)
        .waitForElementVisible(buttonSelector)
        .click(buttonSelector)
        .useXpath()
        .waitForElementVisible("//*[contains(text(), 'Cancel')]")
        .click("//*[contains(text(), 'Cancel')]")
        .waitForElementVisible(
          "//h1[starts-with(normalize-space(.),'" + h1Text + "')]"
        )
        .useCss();
    }

    browser
      .url(browser.launch_url)
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "admin")
      .setValue("#inputPassword", "admin")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible("h1");

    createPageTestCancel(
      browser,
      'a[ui-sref="auth.adminUsers"]',
      'a[ui-sref="auth.adminUserCreate"]',
      "Users"
    );
    createPageTestCancel(
      browser,
      'a[ui-sref="auth.adminTeams"]',
      'a[ui-sref="auth.adminTeamCreate"]',
      "Teams"
    );
    createPageTestCancel(
      browser,
      'a[ui-sref="auth.adminTopics"]',
      'a[ui-sref="auth.adminTopicCreate"]',
      "Topics"
    );
    createPageTestCancel(
      browser,
      'a[ui-sref="auth.adminRemotecis"]',
      'a[ui-sref="auth.adminRemoteciCreate"]',
      "Remotecis"
    );
    createPageTestCancel(
      browser,
      'a[ui-sref="auth.adminProducts"]',
      'a[ui-sref="auth.adminProductCreate"]',
      "Products"
    );

    browser.end();
  },
  "Can create a topic": function(browser) {
    const topicName = "_Test Topic " + Date.now();
    browser
      .url(browser.launch_url)
      .waitForElementVisible("#inputUsername")
      .setValue("#inputUsername", "admin")
      .setValue("#inputPassword", "admin")
      .waitForElementVisible("#logInButton")
      .click("#logInButton")
      .waitForElementVisible('a[ui-sref="auth.adminUsers"]')
      .click('a[ui-sref="auth.adminUsers"]')
      .waitForElementVisible('a[ui-sref="auth.adminTopics"]')
      .click('a[ui-sref="auth.adminTopics"]')
      .waitForElementVisible('a[ui-sref="auth.adminTopicCreate"]')
      .click('a[ui-sref="auth.adminTopicCreate"]')
      .waitForElementVisible("#topicName")
      .setValue("#topicName", topicName)
      .waitForElementVisible("#createButton")
      .click("#createButton")
      .waitForElementVisible('a[ui-sref="auth.adminTopicEdit({id: topic.id})"]')
      .assert.containsText(
        'a[ui-sref="auth.adminTopicEdit({id: topic.id})"]',
        topicName
      );
  }
};
