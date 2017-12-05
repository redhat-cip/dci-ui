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
import { get_teams_from_remotecis, order } from "services/teams";
import { stateGo } from "redux-ui-router";
import find from "lodash/find";

class Ctrl {
  constructor($scope, $ngRedux, $stateParams) {
    this.$ngRedux = $ngRedux;
    this.$stateParams = $stateParams;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.statuses = [
      {
        value: "new",
        name: "new",
        icon: "fa-pause-circle",
        btn: "btn-primary"
      },
      {
        value: "pre-run",
        name: "Pre Run",
        icon: "fa-pause-circle",
        btn: "btn-primary"
      },
      {
        value: "running",
        name: "Running",
        icon: "fa-pause-circle",
        btn: "btn-primary"
      },
      {
        value: "post-run",
        name: "Post Run",
        icon: "fa-pause-circle",
        btn: "btn-primary"
      },
      {
        value: "killed",
        name: "Killed",
        icon: "fa-stop-circle",
        btn: "btn-warning"
      },
      {
        value: "success",
        name: "Success",
        icon: "fa-check-circle",
        btn: "btn-success"
      },
      {
        value: "failure",
        name: "Failure",
        icon: "fa-exclamation-circle",
        btn: "btn-danger"
      }
    ];
    this.status = "";
    this.params = {
      embed: "results,remoteci,components,jobstates,metas,topic",
      limit: 40,
      offset: 0
    };
    const remoteci_id = this.$stateParams.remoteci_id;
    if (remoteci_id) {
      this.params.where = `remoteci_id:${remoteci_id}`;
    }
    this.loading = true;
    this.$ngRedux.dispatch(api("job").all(this.params)).then(() => {
      this.$ngRedux
        .dispatch(api("remoteci").all({ embed: "team" }))
        .then(response => {
          const remotecis = order(response["data"]["remotecis"]);
          this.teams = order(get_teams_from_remotecis(remotecis));
          this.remoteci = find(
            remotecis,
            remoteci => remoteci.id === remoteci_id
          );
          this.loading = false;
        });
    });
  }

  getJobsFromRemoteci(remoteci) {
    this.$ngRedux.dispatch(stateGo("auth.jobs", { remoteci_id: remoteci.id }));
  }

  clearFilters() {
    this.$ngRedux.dispatch(
      stateGo("auth.jobs", { remoteci_id: null }, { reload: true })
    );
  }
}

Ctrl.$inject = ["$scope", "$ngRedux", "$stateParams"];

export default Ctrl;
