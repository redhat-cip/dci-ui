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
  seleniumServerJar: './node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.3.1.jar',
  specs: ['test/e2e/*.spec.js'],
  allScriptsTimeout: 30000,
  capabilities: {
    browserName: 'phantomjs',
    maxSessions: 1
  },

  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
    var reporter = new jasmineReporters.JUnitXmlReporter();
    jasmine.getEnv().addReporter(reporter);
  },

  jasmineNodeOpts: {
    showColors: true
  }
};
