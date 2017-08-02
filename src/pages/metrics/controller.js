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

import * as metricsActions from "services/metrics/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.selectedRange = 3;
    const fetchIfNeeded = this.$ngRedux.dispatch(
      metricsActions.fetchIfNeeded()
    );
    if (fetchIfNeeded) {
      fetchIfNeeded
        .then(() => {
          this.$ngRedux.dispatch(metricsActions.selectFirstMetric());
        })
        .then(() => {
          this.$ngRedux.dispatch(
            metricsActions.filterMetrics({ range: this.selectedRange })
          );
        });
    }
  }

  updatePage(topic, selectedRange) {
    this.$ngRedux.dispatch(metricsActions.selectMetric(topic));
    this.$ngRedux.dispatch(
      metricsActions.filterMetrics({ range: selectedRange })
    );
    this.selectedRange = selectedRange;
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
