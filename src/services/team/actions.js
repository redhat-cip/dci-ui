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

import * as types from "./actionTypes";
import http from "../http";
import api from "../api";

export function setTeam(team) {
  return {
    type: types.SET_TEAM,
    team
  };
}

export function filterAvailableTopics(topics) {
  return {
    type: types.FILTER_AVAILABLE_TOPICS,
    topics
  };
}

export function getTeam(team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      url: `${state.config.apiURL}/api/v1/teams/${team.id}`,
      params: { embed: "topics" }
    };
    return http(request).then(response => {
      dispatch(setTeam(response.data.team));
      dispatch(filterAvailableTopics(state.topics));
      return response;
    });
  };
}

export function associateTopicToTeam(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "post",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams`,
      data: { team_id: team.id }
    };
    return http(request).then(() => dispatch(getTeam(team)));
  };
}

export function removeTopicFromTeam(topic, team) {
  return (dispatch, getState) => {
    const state = getState();
    const request = {
      method: "delete",
      url: `${state.config.apiURL}/api/v1/topics/${topic.id}/teams/${team.id}`,
      headers: { "If-Match": team.etag }
    };
    return http(request).then(() => dispatch(getTeam(team)));
  };
}
