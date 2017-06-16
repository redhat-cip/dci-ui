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

var chromedriver = require("chromedriver");
var connect = require("connect");
var serveStatic = require("serve-static");

var server = connect().use(serveStatic("static")).listen(8000);

module.exports = {
  before: function(done) {
    chromedriver.start();
    done();
  },

  after: function(done) {
    chromedriver.stop();
    server.close(done);
  },

  waitForConditionTimeout: 5000
};
