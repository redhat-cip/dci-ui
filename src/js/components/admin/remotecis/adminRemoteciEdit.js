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

require("app").component("adminRemoteciEdit", {
  templateUrl: "/partials/admin/remotecis/remoteciEdit.html",
  controller: ["$state", "api", "messages", adminRemoteciCtrl],
  bindings: {
    remoteci: "="
  }
});

function adminRemoteciCtrl($state, api, messages) {
  var $ctrl = this;

  $ctrl.update = function() {
    var remoteciName = $ctrl.remoteci.name;

    if ($ctrl.remoteci.data === "error") {
      messages.alert("remoteci data should be a valid json", "danger");
      return;
    }

    api.remotecis
      .update($ctrl.remoteci)
      .then(function() {
        messages.alert("remoteci " + remoteciName + " updated", "success");
        $state.go("adminRemotecis");
      })
      .catch(function(err) {
        messages.alert(
          "cannot update remoteci " +
            remoteciName +
            " (" +
            err.data.message +
            ")",
          "danger"
        );
      });
  };
}
