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
import differenceWith from "lodash/differenceWith";
import isEqual from "lodash/isEqual";
import remove from "lodash/remove";
import * as alertsActions from "services/alerts/actions";
import * as topicsActions from "services/topics/actions";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$scope = $scope;
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    const id = this.$ngRedux.getState().router.currentParams.id;
    this.$ngRedux.dispatch(api("product").sync());
    this.$ngRedux.dispatch(api("team").sync()).then(response => {
      const teams = response.data.teams;
      this.$ngRedux
        .dispatch(api("topic").get({ id }, { embed: "teams" }))
        .then(response => {
          this.topic = response.data.topic;
          this.topicTeams = this.topic.teams;
          this.availableTeams = differenceWith(teams, this.topicTeams, isEqual);
          this.$scope.$apply();
        });
    });
  }

  associateTeamToTopic(team) {
    remove(this.availableTeams, team);
    this.topicTeams.push(team);
    this.$ngRedux.dispatch(
      topicsActions.associateTeamToTopic(this.topic, team)
    );
  }

  removeTeamFromTopic(team) {
    remove(this.topicTeams, team);
    this.availableTeams.push(team);
    this.$ngRedux.dispatch(topicsActions.removeTeamFromTopic(this.topic, team));
  }

  update() {
    const cleanNullValue = false;
    if (!this.topic.next_topic) {
      this.topic.next_topic = null;
    }
    this.$ngRedux
      .dispatch(api("topic").put(this.topic, cleanNullValue))
      .then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success(`topic ${this.topic.name} updated successfully`)
        );
        this.$ngRedux.dispatch(stateGo("auth.adminTopics"));
      });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
