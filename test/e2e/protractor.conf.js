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

exports.config = {
  framework: 'jasmine2',
  seleniumServerJar: '../../node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.3.1.jar',
  specs: ['test/e2e/*.spec.js'],
  allScriptsTimeout: 60000,
  getPageTimeout: 30000,
  capabilities: {
    browserName: 'phantomjs',
    newCommandTimeout: 60,
    maxSessions: 1
  },

  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    browser.manage().timeouts().implicitlyWait(5000);
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter()
    );
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  }
};
