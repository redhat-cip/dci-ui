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
import Keycloak from "keycloak-js";
import localStorage from "../localStorage";

export function configureSSO(config) {
  return () => {
    const ssoConfig = config.sso;
    const sso = new Keycloak({
      url: `${ssoConfig.url}/auth`,
      realm: `${ssoConfig.realm}`,
      clientId: `${ssoConfig.clientId}`
    });

    return new Promise(resolve => {
      sso.init({ onLoad: "check-sso" }).success(authenticated => {
        if (authenticated) {
          localStorage.setJWT(sso.token);
        }
        window._sso = sso;
        resolve(sso);
      });
    });
  };
}

export function KeycloakFactory($window) {
  return $window._sso;
}

KeycloakFactory.$inject = ["$window"];
