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
import axios from "axios";
import { normalize } from "normalizr";
import * as types from "./actionsTypes";
import * as schema from "./schema";

export function fetchJobs() {
  return (dispatch, getState) => {
    dispatch({
      type: types.FETCH_JOBS_REQUEST
    });
    const { apiURL } = getState().config;
    return axios
      .get(`${apiURL}/api/v1/jobs`)
      .then(response => {
        dispatch({
          type: types.FETCH_JOBS_SUCCESS,
          response: normalize(response.data.jobs, schema.jobsSchema)
        });
        return response;
      })
      .catch(error => {
        dispatch({
          type: types.FETCH_JOBS_FAILURE,
          message:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            "Something went wrong"
        });
        return error;
      });
  };
}
