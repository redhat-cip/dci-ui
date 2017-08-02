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

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.current_password = "";
    this.new_password = "";
    this.new_password2 = "";
  }

  changePassword() {
    if (this.new_password !== this.new_password2) {
      this.$ngRedux.dispatch(alertsActions.error("Passwords do not match."));
      return;
    }
    this.$ngRedux
      .dispatch(
        userActions.update({
          etag: this.currentUser.etag,
          current_password: this.current_password,
          new_password: this.new_password
        })
      )
      .then(() => {
        this.$ngRedux.dispatch(
          alertsActions.success("Your password has been reset successfully!")
        );
        this.$ngRedux.dispatch(stateGo("login"));
      });
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
