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

require("app").component("adminUserForm", {
  templateUrl: "/partials/admin/users/userForm.html",
  controller: ["api", adminUserFormCtrl],
  bindings: {
    user: "="
  }
});

function adminUserFormCtrl(api) {
  var $ctrl = this;
  $ctrl.teams = [];
  $ctrl.roles = [];

  function getIdOfRoleUSER(roles) {
    var user_role_id = null;
    for (var i = 0; i < roles.length; i++) {
      var role = roles[i];
      if (role.label === "USER") {
        user_role_id = role.id;
      }
    }
    return user_role_id;
  }

  this.$onInit = function() {
    api.teams.list(null, true).then(function(teams) {
      $ctrl.teams = teams;
    });
    api.roles.list(null, true).then(function(roles) {
      $ctrl.roles = roles;
      if (typeof $ctrl.user.role_id === "undefined") {
        $ctrl.user.role_id = getIdOfRoleUSER(roles);
      }
    });
  };
}
