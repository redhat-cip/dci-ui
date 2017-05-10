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

"use strict";

describe("When a user opens DCI", function() {
  var originalTimeout;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("should be redirected to login page", function() {
    browser.get("/");
    expect(browser.getCurrentUrl()).toBe("http://127.0.0.1:8000/#!/login");
  });

  it("should not have console errors on login page", function() {
    browser.get("/#!/login");
    browser.findElement(by.id("inputUsername")).sendKeys("admin");
    browser.findElement(by.id("inputPassword")).sendKeys("admin");
    browser.findElement(by.id("logInButton")).click();
    browser.waitForAngular();
  });

  it("should be possible to recheck a job", function() {
    element.all(by.css(".job__link")).first().click();
    expect(browser.getCurrentUrl()).toMatch("/jobs/[a-z0-9-]+/results$");
  });

  it("should test job Results page", function() {
    var jobResultsLink = element(by.css("#jobResultsLink"));
    browser.actions().mouseMove(jobResultsLink).click().perform();
    browser.waitForAngular();
  });

  it("should test job Logs page", function() {
    var jobLogsLink = element(by.css("#jobLogsLink"));
    browser.actions().mouseMove(jobLogsLink).click().perform();
    browser.waitForAngular();
  });

  it("should test job Details page", function() {
    var jobDetailsLink = element(by.css("#jobDetailsLink"));
    browser.actions().mouseMove(jobDetailsLink).click().perform();
    browser.waitForAngular();
  });

  it("should test job Edit job page", function() {
    var jobEditLink = element(by.css("#jobEditLink"));
    browser.actions().mouseMove(jobEditLink).click().perform();
    browser.waitForAngular();
  });

  it("should test job Context page", function() {
    var jobContextLink = element(by.css("#jobContextLink"));
    browser.actions().mouseMove(jobContextLink).click().perform();
    browser.waitForAngular();
  });

  it("should test job Stack Details page", function() {
    var jobStackdetailsLink = element(by.css("#jobStackdetailsLink"));
    browser.actions().mouseMove(jobStackdetailsLink).click().perform();
    browser.waitForAngular();
  });

  it("should test job Issues page", function() {
    var jobIssuesLink = element(by.css("#jobIssuesLink"));
    browser.actions().mouseMove(jobIssuesLink).click().perform();
    browser.waitForAngular();
  });

  it("visit /job-definitions", function() {
    browser.get("/#!/job-definitions");
    browser.waitForAngular();
  });

  it("visit /logs", function() {
    browser.get("/#!/logs");
    browser.waitForAngular();
  });

  it("visit /gpanel", function() {
    browser.get("/#!/gpanel");
    browser.waitForAngular();
  });

  it("visit /admin/users", function() {
    browser.get("/#!/admin/users");
    browser.waitForAngular();
  });

  it("visit /admin/teams", function() {
    browser.get("/#!/admin/teams");
    browser.waitForAngular();
  });

  it("visit /admin/topics", function() {
    browser.get("/#!/admin/topics");
    browser.waitForAngular();
  });

  it("visit /admin/remotecis", function() {
    browser.get("/#!/admin/remotecis");
    browser.waitForAngular();
  });

  afterEach(function() {
    browser.manage().logs().get("browser").then(function(browserLog) {
      expect(browserLog.length).toEqual(
        0,
        "there is an error in console.log:\n" +
          JSON.stringify(browserLog, null, 2)
      );
    });
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
