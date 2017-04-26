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

require("app").component("adminUsers", {
  templateUrl: "/partials/admin/users/users.html",
  controller: [
    "$state",
    "$uibModal",
    "api",
    "user",
    "messages",
    AdminUsersCtrl
  ],
  bindings: {
    users: "=",
    teams: "="
  }
});

function AdminUsersCtrl($state, $uibModal, api, user, messages) {
  var $ctrl = this;

  $ctrl.currentUser = user;

  $ctrl.editUser = function(user) {
    $state.go("adminUser", { id: user.id });
  };

  $ctrl.deleteUser = function(user) {
    var userName = user.name;
    var deleteUserModal = $uibModal.open({
      component: "confirmDestructiveAction",
      resolve: {
        data: function() {
          return {
            title: "Delete user " + userName,
            body: "Are you you want to delete user " + userName + "?",
            okButton: "Yes delete " + userName,
            cancelButton: "oups no!"
          };
        }
      }
    });
    deleteUserModal.result.then(function() {
      api.users
        .remove(user.id, user.etag)
        .then(function() {
          messages.alert("user " + userName + " has been removed", "success");
          $state.reload();
        })
        .catch(function() {
          messages.alert("user " + userName + " can't be removed", "danger");
        });
    });
  };
}
