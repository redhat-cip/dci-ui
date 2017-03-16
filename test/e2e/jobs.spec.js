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

describe('DCI jobs page', function() {
  beforeEach(function() {
    var cookie = JSON.stringify({
      status: 2,
      team: {name: 'admin'},
      token: Buffer('admin:admin', 'binary').toString('base64')
    });
    browser.manage().addCookie({
      name: 'user',
      value: encodeURIComponent(cookie),
      path: '/',
      domain: '127.0.0.1'
    });
  });

  it('should be possible to recheck a job', function() {
    browser.get('/');
    element.all(by.css('.glyphicon-repeat')).first().click();
    expect(browser.getCurrentUrl()).toMatch('/jobs/[a-z0-9-]+/results$');
  });

  it('should be possible to view job details', function() {
    browser.get('/');
    element.all(by.css('a.title')).first().click();
    expect(browser.getCurrentUrl()).toMatch('/jobs/[a-z0-9-]+/results$');
  });

  it('should be able to search for a job', function() {
    browser.get('/');
    element(by.id('patternSearch')).sendKeys('Dell_1').submit();
    expect(browser.getCurrentUrl()).toBe('http://127.0.0.1:8000/#/logs?pattern=Dell_1');
  });
});
