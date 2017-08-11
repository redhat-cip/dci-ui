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

import api from "services/api";
import http from "services/http";

export function refreshApiSecret(remoteci, params = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "put",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/api_secret`,
      headers: { "If-Match": remoteci.etag },
      params
    };
    return http(request).then(response => {
      dispatch(
        api("remotecis").actions.update(
          Object.assign({}, remoteci, response.data)
        )
      );
    });
  };
}

export function associateUser(remoteci, user) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users`,
      data: { user_id: `${user.id}` }
    };
    return http(request);
  };
}

export function detachUser(remoteci, user) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/remotecis/${remoteci.id}/users/${user.id}`,
      headers: {"If-Match": user.etag}
    };
    return http(request);
  };
}
