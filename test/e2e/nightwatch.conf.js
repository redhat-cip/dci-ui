// Copyright 2017 Red Hat, Inc.
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

module.exports = {
  src_folders: ["test/e2e/specs"],
  output_folder: "test/e2e/reports",
  globals_path: "test/e2e/globals.js",
  selenium: {
    start_process: false
  },
  test_settings: {
    default: {
      disable_colors: true,
      launch_url: "http://localhost:8000/",
      selenium_port: 9515,
      selenium_host: "localhost",
      default_path_prefix: "",
      skip_testcases_on_fail: false,
      globals: {
        waitForConditionTimeout: 10000
      },
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: ["--headless", "--no-sandbox", "--disable-gpu"]
        }
      }
    }
  }
};
