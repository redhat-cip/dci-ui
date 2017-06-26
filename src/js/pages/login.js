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

require("app").component("dciLogin", {
  templateUrl: "/partials/login.html",
  controller: ["$state", "auth", "messages", dciLoginCtrl]
});

function dciLoginCtrl($state, auth, messages) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.username = "";
    $ctrl.password = "";
  };

  $ctrl.authenticate = function() {
    auth
      .login($ctrl.username, $ctrl.password)
      .then(function() {
        $state.go("index");
      })
      .catch(function(err) {
        if (err.status === 401) {
          messages.alert("Invalid username or password.", "danger");
        } else {
          messages.generalError();
        }
      });
  };
}
