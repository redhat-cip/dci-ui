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

const shortcuts = require("./shortcuts");

module.exports = {
  "Can create and delete a topic": function(browser) {
    const topicName = Date.now();
    shortcuts(browser)
      .login()
      .go("topics")
      .waitForElementVisible("#topics-screen__show-modal-button")
      .click("#topics-screen__show-modal-button")
      .waitForElementVisible("#topic-form__name")
      .clearValue("#topic-form__name")
      .setValue("#topic-form__name", topicName)
      .click('select[id="topic-form__product_id"]')
      .waitForElementVisible("option[name='OpenStack']")
      .click("option[name='OpenStack']")
      .waitForElementVisible("#topic-form__component_types")
      .clearValue("#topic-form__component_types")
      .setValue("#topic-form__component_types", '["puddle"]')
      .waitForElementVisible("#submit-modal-button")
      .click("#submit-modal-button")
      .waitForXpathElementVisible(`//a[normalize-space(text())="${topicName}"]`)
      .waitForElementVisible(".btn-danger")
      .click(".btn-danger")
      .waitForXpathElementVisible(`//button[text()="Yes delete ${topicName}"]`)
      .clickXpath(`//button[text()="Yes delete ${topicName}"]`)
      .waitForXpathElementNotPresent(
        `//a[normalize-space(text())="${topicName}"]`
      )
      .end();
  }
};
