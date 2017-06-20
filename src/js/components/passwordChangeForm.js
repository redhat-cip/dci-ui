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

require("app").component("passwordChangeForm", {
  templateUrl: "/partials/components/passwordChangeForm.html",
  controller: ["api", passwordChangeFormCtrl],
  bindings: {
    user: "=",
    onSuccess: "&",
    onError: "&"
  }
});

function passwordChangeFormCtrl(api) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.current_password = "";
    $ctrl.new_password = "";
    $ctrl.new_password2 = "";
  };

  $ctrl.changePassword = function() {
    if ($ctrl.new_password !== $ctrl.new_password2) {
      $ctrl.onError({ message: "Passwords do not match." });
      return;
    }

    if ($ctrl.current_password === "") {
      $ctrl.onError({ message: "Current password cannot be empty" });
      return;
    }

    if ($ctrl.new_password === "") {
      $ctrl.onError({ message: "Passwords cannot be empty" });
      return;
    }
    api.current_user
      .update({
        etag: $ctrl.user.etag,
        current_password: $ctrl.current_password,
        new_password: $ctrl.new_password
      })
      .then(function() {
        $ctrl.onSuccess({
          message: "Your password has been reset successfully!"
        });
      })
      .catch(function(err) {
        $ctrl.onError({ message: err.data.message });
      });
  };
}
