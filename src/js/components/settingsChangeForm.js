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

require("app").component("settingsChangeForm", {
  templateUrl: "/partials/components/settingsChangeForm.html",
  controller: ["api", settingsChangeFormCtrl],
  bindings: {
    user: "=",
    onSuccess: "&",
    onError: "&"
  }
});

function settingsChangeFormCtrl(api) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.current_password = "";
  };

  $ctrl.changeSettings = function() {
    api.current_user
      .update({
        etag: $ctrl.user.etag,
        current_password: $ctrl.current_password,
        fullname: $ctrl.user.fullname,
        email: $ctrl.user.email
      })
      .then(function() {
        $ctrl.onSuccess({
          message: "Your settings has been change successfully!"
        });
      })
      .catch(function(err) {
        $ctrl.onError({ message: err.data.message });
      });
  };
}
