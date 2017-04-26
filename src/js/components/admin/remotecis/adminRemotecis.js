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

require("app").component("adminRemotecis", {
  templateUrl: "/partials/admin/remotecis/remotecis.html",
  controller: ["$state", "$uibModal", "api", "messages", AdminRemotecisCtrl],
  bindings: {
    remotecis: "="
  }
});

function AdminRemotecisCtrl($state, $uibModal, api, messages) {
  var $ctrl = this;

  $ctrl.editRemoteci = function(remoteci) {
    $state.go("adminRemoteci", { id: remoteci.id });
  };

  $ctrl.toggleLockRemoteci = function(remoteci) {
    if (remoteci.state === "active") {
      remoteci.state = "inactive";
    } else {
      remoteci.state = "active";
    }
    api.remotecis.update(remoteci);
  };

  $ctrl.deleteRemoteci = function(remoteci) {
    var remoteciName = remoteci.name;
    var deleteRemoteciModal = $uibModal.open({
      component: "confirmDestructiveAction",
      resolve: {
        data: function() {
          return {
            title: "Delete remoteci " + remoteciName,
            body: "Are you you want to delete remoteci " + remoteciName + "?",
            okButton: "Yes delete " + remoteciName,
            cancelButton: "oups no!"
          };
        }
      }
    });
    deleteRemoteciModal.result.then(function() {
      api.remotecis.remove(remoteci.id, remoteci.etag).then(
        function() {
          messages.alert(
            "remoteci " + remoteciName + " has been removed",
            "success"
          );
          $state.reload();
        },
        function() {
          messages.alert(
            "remoteci " + remoteciName + " can't be removed",
            "danger"
          );
        }
      );
    });
  };
}
