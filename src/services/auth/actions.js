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
import localStorage from "services/localStorage";
import * as currentUserActions from "services/currentUser/actions";
import * as alertsActions from "services/alerts/actions";

export function login(credentials) {
  return dispatch => {
    const token = window.btoa(
      credentials.username.concat(":", credentials.password)
    );
    localStorage.setToken(token);
    dispatch(currentUserActions.getCurrentUser())
      .then(() => {
        dispatch(stateGo("auth.jobs"));
      })
      .catch(() => {
        dispatch(alertsActions.error("Invalid username or password"));
      });
  };
}

export function setJWT(token) {
  return dispatch => {
    localStorage.setJWT(token);
    dispatch(currentUserActions.getCurrentUser()).then(() => {
      dispatch(stateGo("auth.jobs"));
    });
  };
}

export function refreshJWT() {
  return dispatch => {
    const jwt = localStorage.get().auth.jwt;
    if (jwt && window["_keycloack"]) {
      window["_keycloack"].updateToken().success(function(refreshed) {
        if (refreshed) {
          localStorage.setJWT(window["_keycloack"].token);
        }
      });
    }
  };
}
