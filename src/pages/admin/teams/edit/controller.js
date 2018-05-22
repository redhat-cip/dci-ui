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
import {
  getTeam,
  associateTopicToTeam,
  removeTopicFromTeam
} from "services/team/actions";
import { stateGo } from "redux-ui-router";
import * as alertsActions from "services/alerts/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    const id = this.$ngRedux.getState().router.currentParams.id;
    this.$ngRedux
      .dispatch(api("topic").all())
      .then(() => this.$ngRedux.dispatch(getTeam({ id })));
  }

  update() {
    this.$ngRedux.dispatch(api("team").put(this.team)).then(() => {
      this.$ngRedux.dispatch(
        alertsActions.success(`team ${this.team.name} updated successfully`)
      );
      this.$ngRedux.dispatch(stateGo("auth.adminTeams"));
    });
  }

  removeTopicFromTeam(topic, team) {
    this.$ngRedux.dispatch(removeTopicFromTeam(topic, team));
  }

  associateTopicToTeam(topic, team) {
    this.$ngRedux.dispatch(associateTopicToTeam(topic, team));
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
