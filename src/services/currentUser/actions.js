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

import http from "services/http";
import pick from "lodash/pick";
import * as constants from "./constants";
import schemas from "services/api/schemas";
import localStorage from "services/localStorage";

export function setUser(user) {
  return {
    type: constants.SET_CURRENT_USER,
    payload: user
  };
}

export function update(user) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "put",
      url: `${state.config.apiURL}/api/v1/users/me`,
      data: pick(user, schemas.currentUser),
      headers: { "If-Match": user.etag }
    };
    return http(request);
  };
}

export function getCurrentUser() {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/users/me`,
      params: {
        embed: "team,role,remotecis"
      }
    };
    return http(request).then(response => {
      const currentUser = response.data.user;
      dispatch(setUser(currentUser));
      return Promise.resolve(currentUser);
    });
  };
}
