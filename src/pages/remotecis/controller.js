// Copyright 2017 Red Hat, Inc.
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

import api from "services/api";
import * as alertsActions from "Components/Alerts/AlertsActions";
import DCIRCFile from "services/DCIRCFile";

class Ctrl {
  constructor($scope, $ngRedux, $uibModal) {
    this.$ngRedux = $ngRedux;
    this.$uibModal = $uibModal;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.loading = true;
    this.$ngRedux.dispatch(api("remoteci").all({ embed: "team" })).then(() => {
      this.loading = false;
    });
  }

  toggleLockRemoteci(remoteci) {
    const newRemoteci = Object.assign({}, remoteci);
    if (newRemoteci.state === "active") {
      newRemoteci.state = "inactive";
    } else {
      newRemoteci.state = "active";
    }
    this.$ngRedux.dispatch(api("remoteci").put(newRemoteci));
  }

  deleteRemoteci(remoteci) {
    const remoteciName = remoteci.name;
    const deleteRemoteciModal = this.$uibModal.open({
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
    deleteRemoteciModal.result.then(() => {
      this.$ngRedux.dispatch(api("remoteci").delete(remoteci)).then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success(`remoteci deleted successfully`)
        );
      });
    });
  }

  downloadDCIRCFile(remoteci) {
    DCIRCFile.download(remoteci, "remoteci");
  }
}

Ctrl.$inject = ["$scope", "$ngRedux", "$uibModal"];

export default Ctrl;
