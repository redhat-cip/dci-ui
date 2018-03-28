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
import { setJWT, setBasicToken } from "services/auth";
import * as alertsActions from "services/alerts/actions";
import { stateGo } from "redux-ui-router";

class Ctrl {
  constructor($ngRedux, $stateParams, $urlService, keycloak) {
    this.$ngRedux = $ngRedux;
    this.$stateParams = $stateParams;
    this.$urlService = $urlService;
    this.keycloak = keycloak;
  }

  $onInit() {
    this.seeLoginForm = false;
    this.username = "";
    this.password = "";
    if (this.keycloak.authenticated) {
      setJWT(this.keycloak.token);
      this.$ngRedux.dispatch(getCurrentUser());
      this.redirectToNextPage();
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
    this.keycloak.login();
  }
}

Ctrl.$inject = ["$ngRedux", "$stateParams", "$urlService", "keycloak"];

export default Ctrl;
