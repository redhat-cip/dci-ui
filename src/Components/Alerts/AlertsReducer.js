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

import * as types from "./AlertsActionsTypes";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ADD_ALERT:
      return {
        ...state,
        [action.alert.id]: action.alert
      };
    case types.DELETE_ALERT:
      delete state[action.alert.id];
      return {
        ...state
      };
    default:
      return state;
  }
}
