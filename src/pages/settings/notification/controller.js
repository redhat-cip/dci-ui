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
import * as userActions from "services/currentUser/actions";
import * as alertsActions from "services/alerts/actions";
import * as remotecisActions from "services/remotecis/actions";
import api from "services/api";
import remove from "lodash/remove";
import differenceBy from "lodash/differenceBy";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
      this.$ngRedux
        .dispatch(api('remoteci').all())
        .then(response => {
          this.availableRemotecis = differenceBy(
              response.data.remotecis,
              this.currentUser.remotecis,
              'id'
          )
      });
  }

  associateUserToRemoteci(remoteci) {
      remove(this.availableRemotecis, remoteci);
      this.currentUser.remotecis.push(remoteci);
      this.$ngRedux
        .dispatch(remotecisActions.associateUser(remoteci, this.currentUser))
        .then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success("You subscribed to remoteci notification")
        );
      });
  }

  detachUserToRemoteci(remoteci) {
      remove(this.currentUser.remotecis, remoteci);
      this.availableRemotecis.push(remoteci);
      this.$ngRedux
        .dispatch(remotecisActions.detachUser(remoteci, this.currentUser))
        .then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success("You unsubscribed to remoteci notification")
        );
      });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
