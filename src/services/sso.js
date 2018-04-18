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
import { setJWT } from "./localStorage";

export function configureSSO(config) {
  return () => {
    const ssoConfig = config.sso;
    const sso = new Keycloak({
      url: `${ssoConfig.url}/auth`,
      realm: `${ssoConfig.realm}`,
      clientId: `${ssoConfig.clientId}`
    });

    return new Promise(resolve => {
      sso
        // https://issues.jboss.org/browse/KEYCLOAK-7187
        // .init({ onLoad: "check-sso" })
        .init()
        .success(authenticated => {
          if (authenticated) {
            setJWT(sso.token);
          }
          window._sso = sso;
          resolve(sso);
        })
        .error(() => resolve());
    });
  };
}

export function refreshJWT() {
  setInterval(() => {
    const sso = window._sso;
    if (sso && sso.authenticated) {
      const twoMinutes = 2 * 60;
      sso.updateToken(twoMinutes).success(refreshed => {
        if (refreshed) {
          setJWT(sso.token);
        }
      });
    }
  }, 1 * 60 * 1000);
}
