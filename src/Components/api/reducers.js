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
import merge from "lodash/merge";
import * as types from "./actionsTypes";

const initialState = {
  byId: {},
  allIds: [],
  errorMessage: null,
  isFetching: false
};

function creatReducer(resource) {
  return (state = initialState, action) => {
    switch (action.type) {
      case types[resource].FETCH_REQUEST:
        return {
          ...state,
          isFetching: true
        };
      case types[resource].FETCH_SUCCESS:
        return {
          ...state,
          isFetching: false,
          byId: {
            ...state.byId,
            ...action.entities[resource]
          },
          allIds: action.result
        };
      case types[resource].FETCH_FAILURE:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.message
        };
      default:
        if (action.entities && action.entities[resource]) {
          const byId = merge({}, state.byId, action.entities[resource]);
          return merge({}, state, { byId, allIds: Object.keys(byId) });
        }

        return state;
    }
  };
}

export const jobsReducer = creatReducer("jobs");
