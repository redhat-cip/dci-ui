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

const initialState = {
  isAuthenticated: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case constants.LOG_IN:
      return Object.assign({}, state, {
        isAuthenticated: true
      });
    case constants.SIGN_OUT:
      return Object.assign({}, state, {
        isAuthenticated: false
      });
    default:
      return state;
  }
}
