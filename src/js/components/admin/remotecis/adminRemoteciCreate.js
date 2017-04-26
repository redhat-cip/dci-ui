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

require("app").component("adminRemoteciCreate", {
  templateUrl: "/partials/admin/remotecis/remoteciCreate.html",
  controller: ["$state", "api", "messages", adminRemoteciCtrl]
});

function adminRemoteciCtrl($state, api, messages) {
  var $ctrl = this;

  $ctrl.remoteci = {
    name: ""
  };

  $ctrl.create = function() {
    var remoteciName = $ctrl.remoteci.name;
    api.remotecis
      .create($ctrl.remoteci)
      .then(function() {
        messages.alert("remoteci " + remoteciName + " created", "success");
        $state.reload();
      })
      .catch(function(err) {
        messages.alert(
          "cannot create remoteci " +
            remoteciName +
            " (" +
            err.data.message +
            ")",
          "danger"
        );
      });
  };
}
