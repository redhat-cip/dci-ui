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

import * as types from "./JobsActionsTypes";

const initialState = {
  byId: {},
  allIds: [],
  isFetching: false,
  loaded: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_JOBS_PENDING:
      return {
        ...state,
        isFetching: true,
        loaded: false
      };
    case types.FETCH_JOBS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        loaded: true
      };
    default:
      return state;
  }
}
