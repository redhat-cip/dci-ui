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

import { getCurrentUser } from "services/currentUser/actions";
import { setJWT, setBasicToken } from "services/localStorage";
import * as alertsActions from "Components/Alerts/AlertsActions";
import { stateGo } from "redux-ui-router";

class Ctrl {
  constructor($ngRedux, $stateParams, $urlService) {
    this.$ngRedux = $ngRedux;
    this.$stateParams = $stateParams;
    this.$urlService = $urlService;
  }

  $onInit() {
    this.seeLoginForm = false;
    this.username = "";
    this.password = "";
    if (window._sso && window._sso.authenticated) {
      setJWT(window._sso.token);
      this.$ngRedux.dispatch(getCurrentUser()).then(() => {
        this.redirectToNextPage();
      });
    }
  }

  authenticate() {
    const token = window.btoa(this.username.concat(":", this.password));
    setBasicToken(token);
    this.$ngRedux
      .dispatch(getCurrentUser())
      .then(() => this.redirectToNextPage())
      .catch(() =>
        this.$ngRedux.dispatch(
          alertsActions.error("Invalid username or password")
        )
      );
  }

  redirectToNextPage() {
    const nextUrl = this.$stateParams.next;
    const nextState = this.$urlService.match({ path: nextUrl });
    const stateName = nextState.rule.state.name;
    const params = nextState.match;
    this.$ngRedux.dispatch(stateGo(stateName, params));
  }

  sso() {
    window._sso.login();
  }
}

Ctrl.$inject = ["$ngRedux", "$stateParams", "$urlService"];

export default Ctrl;
