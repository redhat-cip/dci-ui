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

import * as constants from "./constants";
import http from "services/http";

export function fetchStart() {
  return {
    type: constants.FETCH_REQUEST
  };
}

export function fetchOk(resources) {
  return {
    type: constants.FETCH_SUCCESS,
    payload: resources
  };
}

export function fetchKo(error) {
  return {
    type: constants.FETCH_FAILURE,
    payload: {
      error
    },
    error: true
  };
}

export function selectMetric(metric) {
  return {
    type: constants.GET_METRIC,
    payload: metric
  };
}

export function selectFirstMetric() {
  return {
    type: constants.SELECT_FIRST_METRIC
  };
}

export function fetch(params) {
  return (dispatch, getState) => {
    dispatch(fetchStart());
    const state = getState();
    const request = {
      method: "get",
      url: `${state.config.apiURL}/api/v1/metrics/topics`,
      params
    };
    return http(request)
      .then(response => {
        dispatch(fetchOk(response.data.topics));
        return response;
      })
      .catch(err => {
        dispatch(fetchKo(err));
        return err;
      });
  };
}

export function shouldFetch(state) {
  return state.metrics.items.length === 0;
}

export function fetchIfNeeded(params) {
  return (dispatch, getState) => {
    if (shouldFetch(getState())) {
      return dispatch(fetch(params));
    }
  };
}

export function filterMetrics({ range, now }) {
  return {
    type: constants.FILTER_METRIC,
    payload: {
      range,
      now
    }
  };
}
