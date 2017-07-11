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

require("app").component("updatePassword", {
  templateUrl: "/partials/pages/settings/updatePassword.html",
  controller: ["$state", "auth", "api", "messages", "user", passwordPageCtrl]
});

function passwordPageCtrl($state, auth, api, messages, user) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.user = user;
    $ctrl.current_password = "";
    $ctrl.new_password = "";
    $ctrl.new_password2 = "";
  };

  $ctrl.changePassword = function() {
    if ($ctrl.new_password !== $ctrl.new_password2) {
      messages.alert("Passwords do not match.", "danger");
      return;
    }

    api.current_user
      .update({
        etag: $ctrl.user.etag,
        current_password: $ctrl.current_password,
        new_password: $ctrl.new_password
      })
      .then(function() {
        messages.alert("Your password has been reset successfully!", "success");
        auth.logout();
        $state.go("login");
      })
      .catch(function(err) {
        messages.alert(err.data.message, "danger");
      });
  };
}
