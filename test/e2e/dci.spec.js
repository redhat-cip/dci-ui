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

'use strict';

describe('When a user opens DCI', function() {
  it('should be redirected to login page', function() {
    browser.get('/');
    expect(browser.getCurrentUrl()).toBe('http://127.0.0.1:8000/#!/login');
  });
  it('should not have console errors on login page', function() {
    browser.get('/#!/login');
    browser.findElement(by.id('inputUsername')).sendKeys('admin');
    browser.findElement(by.id('inputPassword')).sendKeys('admin');
    browser.findElement(by.id('logInButton')).click();
    browser.sleep(2000);
    browser.waitForAngular();
  });
  it('should be possible to recheck a job', function() {
    element.all(by.css('.job__link')).first().click();
    expect(browser.getCurrentUrl()).toMatch('/jobs/[a-z0-9-]+/results$');
  });
  it('should test Logs tab', function() {
    element(by.xpath("//li//a[text()='Logs']")).click();
  });
  it('should test Details tab', function() {
    element(by.xpath("//li//a[text()='Details']")).click();
  });
  it('should test Edit job tab', function() {
    element(by.xpath("//li//a[text()='Edit job']")).click();
  });
  it('should test Context job tab', function() {
    element(by.xpath("//li//a[text()='Context']")).click();
  });
  it('should test Stack Details job tab', function() {
    element(by.xpath("//li//a[text()='Stack Details']")).click();
  });
  it('should test Files job tab', function() {
    element(by.partialLinkText("Issues")).click();
  });
  it('should test Files job tab', function() {
    element(by.partialLinkText("Files")).click();
  });
  it('visit /job-definitions', function() {
    browser.get('/#!/job-definitions');
    browser.waitForAngular();
  });
  it('visit /logs', function() {
    browser.get('/#!/logs');
    browser.waitForAngular();
  });
  it('visit /information', function() {
    browser.get('/#!/information');
    browser.waitForAngular();
  });
  it('visit /gpanel', function() {
    browser.get('/#!/gpanel');
    browser.waitForAngular();
  });
  it('visit /admin/users', function() {
    browser.get('/#!/admin/users');
    browser.waitForAngular();
  });
  it('visit /admin/teams', function() {
    browser.get('/#!/admin/teams');
    browser.waitForAngular();
  });
  it('visit /admin/topics', function() {
    browser.get('/#!/admin/topics');
    browser.waitForAngular();
  });
  it('visit /admin/remotecis', function() {
    browser.get('/#!/admin/remotecis');
    browser.waitForAngular();
  });
  it('search a job', function() {
    browser.get('/');
    browser.waitForAngular();
    element(by.id('patternSearch')).sendKeys('Dell_1').submit();
    expect(browser.getCurrentUrl()).toMatch('/logs?pattern=Dell_1');
  });
  afterEach(function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
      expect(browserLog.length).toEqual(0,
        'there is an error in console.log:\n' + JSON.stringify(browserLog, null, 2));
    });
  });
});
