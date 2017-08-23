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

const initialState = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  item: null
};

export default function(resourceString) {
  const constants = Constants(resourceString);

  return function(state = initialState, action) {
    switch (action.type) {
      case constants.FETCH_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
          didInvalidate: false
        });
      case constants.FETCH_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: false,
          items: action.payload
        });
      case constants.FETCH_FAILURE:
        return Object.assign({}, state, {
          isFetching: false,
          didInvalidate: true
        });
      case constants.SET:
        let newItem = null;
        const payload = action.payload;
        if (state.item && state.item.id === payload.id) {
          newItem = Object.assign({}, state.item, payload);
        }
        return Object.assign({}, state, {
          item: newItem || payload
        });
      case constants.UPDATED:
        return Object.assign({}, state, {
          items: state.items.map(item => {
            if (action.payload.id !== item.id) {
              return item;
            }
            return action.payload;
          })
        });
      case constants.CREATED:
        return Object.assign({}, state, {
          items: state.items.concat([action.payload])
        });
      case constants.DELETED:
        return Object.assign({}, state, {
          items: state.items.filter(item => action.payload.id !== item.id)
        });
      default:
        return state;
    }
  };
}
