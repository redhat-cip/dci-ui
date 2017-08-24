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
import { stateGo } from "redux-ui-router";
import * as alertsActions from "services/alerts/actions";
import * as currentUserActions from "services/currentUser/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.$ngRedux.dispatch(currentUserActions.getCurrentUser());
    this.remoteci = {
      name: "",
      team_id: null,
      allow_upgrade_job: false
    };
    this.$ngRedux.dispatch(api("team").sync());
  }

  create() {
    if (this.remoteci.team_id === null) {
      this.$ngRedux.dispatch(alertsActions.error("Remoteci need a team"));
      return;
    }

    this.$ngRedux.dispatch(api("remoteci").post(this.remoteci)).then(() => {
      this.$ngRedux.dispatch(
        alertsActions.success(
          `remoteci ${this.remoteci.name} created successfully`
        )
      );
      this.$ngRedux.dispatch(stateGo("auth.adminRemotecis"));
    });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
