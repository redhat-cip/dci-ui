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
import * as alertsActions from "services/alerts/actions";

class Ctrl {
  constructor($scope, $ngRedux, $uibModal) {
    this.$ngRedux = $ngRedux;
    this.$uibModal = $uibModal;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.$ngRedux.dispatch(api("fingerprint").allIfNeeded());
  }

  deleteFingerprint(fingerprint) {
    const fingerprintName = fingerprint.name;
    const deleteFingerprintModal = this.$uibModal.open({
      component: "confirmDestructiveAction",
      resolve: {
        data: function() {
          return {
            title: "Delete fingerprint " + fingerprintName,
            body: "Are you sure want to delete fingerprint " + fingerprintName + "?",
            okButton: "Yes delete " + fingerprintName,
            cancelButton: "oups no!"
          };
        }
      }
    });
    deleteFingerprintModal.result.then(() => {
      this.$ngRedux.dispatch(api("fingerprint").delete(fingerprint)).then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success(`fingerprint successfully deleted`)
        );
      });
    });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux", "$uibModal"];

export default Ctrl;
