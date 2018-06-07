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
import { createActionsTypes } from "./actionsTypes";

const initialState = {
  byId: {},
  allIds: [],
  errorMessage: null,
  isFetching: false
};

function mergeEntities(state, resources) {
  const byId = merge({}, state.byId, resources);
  return {
    ...state,
    byId,
    allIds: Object.keys(byId)
  };
}

export function createReducer(resource) {
  const resources = `${resource}s`;
  return (state = initialState, action) => {
    switch (action.type) {
      case createActionsTypes(resource).FETCH_ALL_REQUEST:
        return {
          ...state,
          isFetching: true
        };
      case createActionsTypes(resource).FETCH_ALL_SUCCESS:
        return {
          ...mergeEntities(state, action.entities[resources]),
          isFetching: false
        };
      case createActionsTypes(resource).FETCH_ALL_FAILURE:
        return {
          ...state,
          isFetching: false,
          errorMessage: action.message
        };
      case createActionsTypes(resource).DELETE_SUCCESS:
        const newState = { ...state, isFetching: false };
        delete newState.byId[action.id];
        return {
          ...newState,
          allIds: Object.keys(newState.byId)
        };
      default:
        if (action.entities && action.entities[resources]) {
          return mergeEntities(state, action.entities[resources]);
        }
        return state;
    }
  };
}
