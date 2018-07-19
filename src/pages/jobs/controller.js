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
      },
      {
        value: "error",
        name: "Error",
        icon: "fa-exclamation-circle",
        btn: "btn-danger"
      }
    ];
    this.status = "";
    this.count = 0;
    this.nbPages = 1;
    this.page = this.$stateParams.page ? parseInt(this.$stateParams.page) : 1;
    this.limit = 10;
    this.offset = (this.page - 1) * this.limit;
    this.params = {
      embed: "results,remoteci,components,jobstates,metas,topic,rconfiguration",
      limit: this.limit,
      offset: this.offset
    };
    this.remoteci_id = this.$stateParams.remoteci_id;
    if (this.remoteci_id) {
      this.params.where = `remoteci_id:${this.remoteci_id}`;
    }
    this.loading = true;
    this.getJobs(this.params).then(() => {
      this.$ngRedux
        .dispatch(api("remoteci").all({ embed: "team" }))
        .then(response => {
          const remotecis = order(response.data.remotecis);
          this.teams = order(get_teams_from_remotecis(remotecis));
          this.remoteci = find(
            remotecis,
            remoteci => remoteci.id === this.remoteci_id
          );
          this.loading = false;
        });
    });
  }

  goToPage(page) {
    if (page < 1 || page > this.nbPages) return;
    this.$ngRedux.dispatch(
      stateGo(
        "auth.jobs",
        {
          remoteci_id: this.remoteci_id,
          page
        },
        { reload: true }
      )
    );
  }

  getJobs(params) {
    return this.$ngRedux.dispatch(api("job").all(params)).then(response => {
      this.count = response.data._meta.count;
      this.nbPages = Math.round(this.count / this.limit);
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
