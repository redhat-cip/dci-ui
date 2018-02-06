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

import * as authActions from "services/auth/actions";
import Keycloak from "keycloak-js";
import { stateGo } from "redux-ui-router";

class Ctrl {
  constructor($ngRedux) {
    this.$ngRedux = $ngRedux;
  }

  $onInit() {
    this.username = "";
    this.password = "";

    const ssoConfig = this.$ngRedux.getState().config.sso;
    if (typeof ssoConfig !== "undefined") {
      window["_keycloack"] = Keycloak({
        url: `${ssoConfig.url}/auth`,
        realm: `${ssoConfig.realm}`,
        clientId: `${ssoConfig.clientId}`
      });

      window["_keycloack"]
        .init({ onLoad: "check-sso" })
        .success(authenticated => {
          if (authenticated) {
            this.$ngRedux.dispatch(
              authActions.setJWT(window["_keycloack"].token)
            );
            this.$ngRedux.dispatch(stateGo("auth.jobs"));
          }
        });
    }
  }

  authenticate() {
    this.$ngRedux.dispatch(
      authActions.login({ username: this.username, password: this.password })
    );
  }

  sso() {
    window["_keycloack"].login();
  }
}

Ctrl.$inject = ["$ngRedux"];

export default Ctrl;
