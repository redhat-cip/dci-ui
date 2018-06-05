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

import { stateGo } from "redux-ui-router";
import api from "services/api";
import * as alertsActions from "Components/Alert/AlertsActions";
import * as jobsActions from "services/jobs/actions";

class Ctrl {
  constructor($scope, $ngRedux, $uibModal) {
    this.$ngRedux = $ngRedux;
    this.$uibModal = $uibModal;
    this.$scope = $scope;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.seeDetails = false;
    this.statuses = ["success", "failure", "error"];
  }

  open(job, page) {
    this.$ngRedux.dispatch(stateGo(page, job));
  }

  updateJob() {
    this.$ngRedux
      .dispatch(api("job").put(this.job, { omitNil: true }))
      .then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success("job updated successfully")
        );
      });
  }

  delete(job) {
    const deleteUserModal = this.$uibModal.open({
      component: "confirmDestructiveAction",
      resolve: {
        data: function() {
          return {
            title: "Delete job",
            body: `Are you you want to delete job with id: ${job.id}?`,
            okButton: "Yes delete it",
            cancelButton: "oups no!"
          };
        }
      }
    });
    deleteUserModal.result.then(() => {
      this.$ngRedux.dispatch(api("job").delete(job)).then(() => {
        this.$ngRedux.dispatch(alertsActions.success("job deleted"));
      });
    });
  }

  addMeta(job, meta) {
    this.$ngRedux.dispatch(jobsActions.createMeta(job, meta)).then(() => {
      this.$scope.$apply();
      this.meta = { value: "", name: "" };
      this.$ngRedux.dispatch(
        alertsActions.success("meta created successfully")
      );
    });
  }

  deleteMeta(job, meta) {
    this.$ngRedux.dispatch(jobsActions.deleteMeta(job, meta)).then(() => {
      this.$scope.$apply();
      this.$ngRedux.dispatch(
        alertsActions.success("meta deleted successfully")
      );
    });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux", "$uibModal"];

export default Ctrl;
