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
import { getTopic } from "services/topics/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => {
      return {
        topic: state.topic
      };
    })(this);
    $scope.$on("$destroy", unsubscribe);
  }
  $onInit() {
    this.loading = false;
    const id = this.$ngRedux.getState().router.currentParams.id;
    if (!this.topic) {
      this.loading = true;
      this.$ngRedux.dispatch(getTopic({ id })).then(() => {
        this.loading = false;
      });
    }
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
