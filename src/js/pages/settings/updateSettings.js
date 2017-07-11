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

require("app").component("updateSettings", {
  templateUrl: "/partials/pages/settings/updateSettings.html",
  controller: [
    "$state",
    "auth",
    "api",
    "messages",
    "user",
    "moment",
    updateSettingsCtrl
  ]
});

function updateSettingsCtrl($state, auth, api, messages, user, moment) {
  var $ctrl = this;

  this.$onInit = function() {
    $ctrl.user = user;
    $ctrl.current_password = "";
    $ctrl.timezones = moment.tz.names();
  };

  $ctrl.changeSettings = function() {
    api.current_user
      .update({
        etag: $ctrl.user.etag,
        current_password: $ctrl.current_password,
        fullname: $ctrl.user.fullname,
        email: $ctrl.user.email,
        timezone: $ctrl.user.timezone
      })
      .then(function() {
        messages.alert(
          "Your settings has been change successfully!",
          "success"
        );
        auth.saveUser($ctrl.user);
        $state.reload();
      })
      .catch(function(err) {
        messages.alert(err.data.message, "danger");
      });
  };
}
