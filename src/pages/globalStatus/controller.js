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
import * as topicsActions from "services/topics/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.loading = true;
    this.$ngRedux.dispatch(api("topic").all()).then(response => {
      this.$ngRedux
        .dispatch(topicsActions.fetchJobs(response.data.topics))
        .then(topics => {
          this.$ngRedux.dispatch(api("topic").save(topics));
          this.loading = false;
        });
    });
  }

  getJobStatusClass(job_status) {
    const infoStatuses = ["new", "pre-run", "post-run"];
    const failureStatuses = [
      "failure",
      "product-failure",
      "deployment-failure"
    ];
    if (infoStatuses.indexOf(job_status) !== -1) {
      return "text-info";
    } else if (failureStatuses.indexOf(job_status) !== -1) {
      return "text-danger";
    } else if (job_status === "success") {
      return "text-success";
    } else {
      return "text-warning";
    }
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
