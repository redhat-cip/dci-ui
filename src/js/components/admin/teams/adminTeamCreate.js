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

require("app").component("adminTeamCreate", {
  templateUrl: "/partials/admin/teams/teamCreate.html",
  controller: ["$state", "api", "messages", adminTeamCtrl]
});

function adminTeamCtrl($state, api, messages) {
  var $ctrl = this;

  $ctrl.team = {
    name: "",
    email: "",
    notification: null
  };

  $ctrl.create = function() {
    var teamName = $ctrl.team.name;
    api.teams
      .create($ctrl.team)
      .then(function() {
        messages.alert("team " + teamName + " created", "success");
        $state.reload();
      })
      .catch(function(err) {
        messages.alert(
          "cannot create team " + teamName + " (" + err.data.message + ")",
          "danger"
        );
      });
  };
}
