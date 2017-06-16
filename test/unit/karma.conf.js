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

module.exports = function(config) {
  config.set({
    basePath: "../..",
    frameworks: ["jasmine"],
    files: [
      "static/js/app.js",
      "node_modules/angular-mocks/angular-mocks.js",
      "src/partials/**/*.html",
      "test/unit/helper.js",
      "test/unit/**/*.spec.js"
    ],
    exclude: [],
    preprocessors: {
      "src/partials/**/*.html": ["ng-html2js"]
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: "src/",
      prependPrefix: "/",
      moduleName: "templates"
    },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    browsers: ["ChromeHeadless"],
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--no-sandbox",
          "--disable-gpu",
          "--window-size=1920x1080",
          "--remote-debugging-port=9222"
        ]
      }
    },
    singleRun: true,
    concurrency: Infinity
  });
};
