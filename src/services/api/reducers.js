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

export default function(resource) {
  const constant = Constants(resource);
  return (state = [], action) => {
    switch (action.type) {
      case Constants(`${resource}s`).SET:
        return action.payload.slice();
      case constant.CREATE:
        return state.concat([action.payload]);
      case constant.UPDATE:
        return state.map(item => {
          if (action.payload.id === item.id) {
            return action.payload;
          }
          return item;
        });
      case constant.REMOVE:
        return state.filter(item => action.payload.id !== item.id);
      default:
        return state;
    }
  };
}
