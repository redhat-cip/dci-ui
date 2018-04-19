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
import * as constants from "./constants";
import * as alertsActions from "services/alerts/actions";

export function setTopic(topic) {
  return {
    type: constants.SET_TOPIC,
    topic
  };
}

export function getTopic(topic) {
  return (dispatch, getState) => {
    const state = getState();
    return http({
      method: "get",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}`
    })
      .then(response => {
        dispatch(setTopic(response.data.topic));
        return response;
      })
      .catch(error => {
        dispatch(alertsActions.errorApi(error.response));
        throw error;
      });
  };
}

export function associateTeamToTopic(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams`,
      data: { team_id: team.id }
    };
    return http(request);
  };
}

export function removeTeamFromTopic(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams/${team.id}`,
      headers: { "If-Match": team.etag }
    };
    return http(request);
  };
}
