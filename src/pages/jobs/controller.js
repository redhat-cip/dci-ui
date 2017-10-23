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

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
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
    this.filter = {};
    this.params = {
      embed: "results,remoteci,components,jobstates,metas,topic",
      limit: 40,
      offset: 0
    };
    this.loading = true;
    this.$ngRedux.dispatch(api("job").all(this.params)).then(() => {
      this.loading = false;
    });
  }

  clearFilters() {
    this.search = "";
    this.filter = {};
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
