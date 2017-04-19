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

describe('When user open DCI not authenticated', function() {
  it('should redirect to login page', function() {
    browser.get('http://localhost:8000');
    expect(browser.getCurrentUrl()).toBe('http://localhost:8000/#!/login');
  });
  it('should not have console errors', function() {
    browser.get('http://localhost:8000');
    browser.manage().logs().get('browser').then(function(browserLog) {
      expect(browserLog.length).toEqual(0,
        'there is an error in console.log:\n' + JSON.stringify(browserLog, null, 2));
    });
  });
});
