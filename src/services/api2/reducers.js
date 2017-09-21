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

import Constants from "./constants";

function getInitialState(resourceString) {
  if (resourceString.endsWith("s")) {
    return [];
  }
  return {};
}

export default function(resourceString) {
  const constants = Constants(resourceString);
  return (state, action) => {
    state =
      typeof state === "undefined" ? getInitialState(resourceString) : state;
    switch (action.type) {
      case constants.SET_LIST:
        return action.payload.slice();
      case constants.SET:
        const payload = action.payload;
        if (state.id === payload.id) {
          return Object.assign({}, state, payload);
        }
        return Object.assign({}, payload);
      case constants.CREATE:
        return state.concat([action.payload]);
      case constants.UPDATE:
        return state.map(item => {
          if (action.payload.id === item.id) {
            return action.payload;
          }
          return item;
        });
      case constants.DELETE:
        return state.filter(item => action.payload.id !== item.id);
      default:
        return state;
    }
  };
}
