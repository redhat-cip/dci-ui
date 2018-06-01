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
import * as currentUserActions from "services/currentUser/actions";
import * as alertsActions from "components/Alert/AlertsActions";
import moment from "moment-timezone/builds/moment-timezone-with-data-2012-2022";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.current_password = "";
    this.timezones = moment.tz.names();
  }

  changeSettings() {
    this.$ngRedux
      .dispatch(
        currentUserActions.update({
          etag: this.currentUser.etag,
          current_password: this.current_password,
          fullname: this.currentUser.fullname,
          email: this.currentUser.email,
          timezone: this.currentUser.timezone
        })
      )
      .then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success("Your settings has been change successfully!")
        );
        this.$ngRedux.dispatch(stateGo("auth.jobs"));
      });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
