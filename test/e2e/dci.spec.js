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
  it('it should be redirected to login page', function() {
    browser.get('/');
    expect(browser.getCurrentUrl()).toBe('http://127.0.0.1:8000/#!/login');
  });
  it('it should not have console errors on login page', function() {
    browser.get('/#!/login');
    browser.findElement(by.id('inputUsername')).sendKeys('admin');
    browser.findElement(by.id('inputPassword')).sendKeys('admin');
    browser.findElement(by.id('logInButton')).click();
    browser.waitForAngular();
  });
  it('should be possible to recheck a job', function() {
    element.all(by.css('.btn-recheck:not([disabled])')).first().click();
    expect(browser.getCurrentUrl()).toMatch('/jobs/[a-z0-9-]+/results$');
  });
  afterEach(function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
      expect(browserLog.length).toEqual(0,
        'there is an error in console.log:\n' + JSON.stringify(browserLog, null, 2));
    });
  });
});
